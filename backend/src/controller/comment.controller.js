import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../util/asyncHandler.js";
import AppError from "../util/AppError.js";

/**
 * @desc    Handle comment for a post
 * @route   POST /:postId/comment
 * @access  Private
 */

export const createComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  const { content, parentComment } = req.body;

  const post = await Post.findById(postId).exec();

  if(!post || post.isDeleted || post.isOrphaned){
    throw new AppError("Cannot comment on this post", 403);
  }

  if(parentComment){
    const parent = await Comment.findById(parentComment).exec();

    if(!parent || parent.isDeleted || parent.postId.toString() !== postId){
      throw new AppError("Invalid parent comment", 400)
    }
  }

  const session = await mongoose.startSession();

  try{
    session.startTransaction();

    const newComment = await Comment.create(
      [
        {
          postId,
          userId,
          text: content,
          parentCommentId: parentComment || null,
        },
      ],
      { session }
    );

    await Post.updateOne(
      { _id: postId }, 
      { $inc: { commentCount: 1 } },
      { session }
    );

    await session.commitTransaction();e

    return res.status(201).json({
      success: true,
      data: newComment,
    });

  }catch(error){
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    fetch comments for a post
 * @route   Get /:portId/comments
 * @access  Public
 */

export const getRootComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const sort = req.query.sort || "new";
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  let responsePayload;

  if (sort === "new") {
    const cursor = req.query.cursor;

    let matchStage = {
      postId: new mongoose.Types.ObjectId(postId),
      parentCommentId: null,
      isDeleted: false,
    };

    if (cursor) {
      const cursorDoc = await Comment.findById(cursor)
        .select("createdAt")
        .lean();

      if (cursorDoc) {
        matchStage.$or = [
          { createdAt: { $lt: cursorDoc.createdAt } },
          {
            createdAt: cursorDoc.createdAt,
            _id: { $lt: cursorDoc._id },
          },
        ];
      }
    }

    const comments = await Comment.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
    ]);

    let nextCursor = null;
    const hasNextPage = comments.length > limit;

    if (hasNextPage) {
      nextCursor = comments[limit - 1]._id;
      comments.pop();
    }

    responsePayload = {
      paginationType: "cursor",
      nextCursor,
      hasNextPage,
      results: comments.length,
      data: comments,
    };    

    return res.status(200).json({
      success: true,
      data: responsePayload,
      
    });
  }

  if (sort === "hot") {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      postId,
      parentCommentId: null,
      isDeleted: false,
    })
      .sort({ vote: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    responsePayload = {
      paginationType: "offset",
      page,
      results: comments.length,
      data: comments,
    };

    return res.status(200).json({
      success: true,
      data: responsePayload,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid sort type",
  });
});


/**
 * @desc    fetch comments for a post
 * @route   Get /:commentId/comments
 * @access  Public
 */

export async function getReplies(req, res) {
  const { commentId } = req.params;
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const cursor = req.query.cursor;

  const session = await mongoose.startSession();

  try {
    let responsePayload;

    await session.withTransaction(
      async () => {
        let matchStage = {
          parentCommentId: new mongoose.Types.ObjectId(commentId),
          isDeleted: false,
        };

        if (cursor) {
          const cursorDoc = await Comment.findById(cursor)
            .select("createdAt")
            .session(session)
            .lean();

          if (cursorDoc) {
            matchStage.$or = [
              { createdAt: { $lt: cursorDoc.createdAt } },
              {
                createdAt: cursorDoc.createdAt,
                _id: { $lt: cursorDoc._id },
              },
            ];
          }
        }

        const replies = await Comment.aggregate([
          { $match: matchStage },

          {
            $lookup: {
              from: "comments",
              let: { replyId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$parentCommentId", "$$replyId"] },
                        { $eq: ["$isDeleted", false] },
                      ],
                    },
                  },
                },
                { $count: "count" },
              ],
              as: "replyMeta",
            },
          },

          {
            $addFields: {
              replyCount: {
                $ifNull: [{ $arrayElemAt: ["$replyMeta.count", 0] }, 0],
              },
            },
          },

          { $project: { replyMeta: 0 } },

          { $sort: { createdAt: -1, _id: -1 } },

          { $limit: limit + 1 },
        ]).session(session); 

        let nextCursor = null;
        const hasNextPage = replies.length > limit;

        if (hasNextPage) {
          nextCursor = replies[limit - 1]._id;
          replies.pop();
        }

        responsePayload = {
          nextCursor,
          hasNextPage,
          results: replies.length,
          data: replies,
        };
      },
      {
        readConcern: { level: "snapshot" }, 
        writeConcern: { w: "majority" },
      }
    );

    return res.status(200).json({
      success: true,
      data: responsePayload,
    });

  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * @desc    delete a comment
 * @route   DELETE /:commentId/delete
 * @access  private
 */


import mongoose from "mongoose";

export async function deleteComment(req, res) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {

      const userId = req.user?._id;
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId)
        .session(session);

      if (!comment) {
        throw new AppError("Comment not found", 404);
      }

      if (comment.isDeleted) {
        return res.status(200).json({
          success: true,
          message: "Comment already deleted",
        });
      }

      if (comment.userId.toString() !== userId.toString()) {
        throw new AppError("You are not allowed to delete this comment", 403)
      }

      const commentAge =
        Date.now() - new Date(comment.createdAt).getTime();

      const ageWithinLimit = commentAge <= 60 * 1000;

      const hasReplies = await Comment.exists({
        parentCommentId: comment._id,
        isDeleted: false,
      }).session(session);

      const hasVotes = await Vote.exists({
        targetId: comment._id,
        targetType: "Comment",
      }).session(session);

      const isHardDelete =
        ageWithinLimit && !hasReplies && !hasVotes;

      // ✅ HARD DELETE
      if (isHardDelete) {

        await Comment.deleteOne({ _id: comment._id })
          .session(session);

        await Vote.deleteMany({
          targetId: comment._id,
          targetType: "Comment",
        }).session(session);

        await Post.updateOne(
          { _id: comment.postId },
          { $inc: { commentCount: -1 } }
        ).session(session);

        return res.status(200).json({
          success: true,
          message: "Comment permanently deleted",
        });
      }

      // ✅ SOFT DELETE
      comment.isDeleted = true;
      comment.deletedAt = new Date();

      await comment.save({ session });

      await Vote.updateMany(
        {
          targetId: comment._id,
          targetType: "Comment",
          isDeleted: false,
        },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
          },
        }
      ).session(session);

      await Post.updateOne(
        { _id: comment.postId },
        { $inc: { commentCount: -1 } }
      ).session(session);

      return res.status(200).json({
        success: true,
        message: "Comment soft deleted",
      });
    });

  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}