import Vote from "../models/vote.model.js";
import Post from "../models/post.model.js";

/**
 * @desc    Handle Vote for a post
 * @route   PATCH /:postId/vote
 * @access  Private
 */
export async function postVote(req, res) {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { action } = req.body; // "upvote" | "downvote"

    const post = await Post.findById(postId).exec();
    if (!post || post.isDeleted || post.isOrphaned) {
      return res.status(403).json({
        success: false,
        message: "Cannot vote on this post",
      });
    }

    const existingVote = await Vote.findOne({
      targetId: postId,
      targetType: "Post",
      userId,
    }).exec();

    let updatedVote = null;

    // CASE 1: Existing vote
    if (existingVote) {
      // Toggle same vote
      if (existingVote.type === action) {
        await existingVote.deleteOne();

        await Post.updateOne(
          { _id: postId },
          {
            $inc: {
              upvoteCount: action === "upvote" ? -1 : 0,
              downvoteCount: action === "downvote" ? -1 : 0,
            },
          }
        );
      }
      // Switch vote
      else {
        await Vote.updateOne(
          { _id: existingVote._id },
          { $set: { type: action } }
        );

        await Post.updateOne(
          { _id: postId },
          {
            $inc: {
              upvoteCount: action === "upvote" ? 1 : -1,
              downvoteCount: action === "downvote" ? 1 : -1,
            },
          }
        );

        updatedVote = { ...existingVote.toObject(), type: action };
      }
    }

    // CASE 2: First vote
    else {
      updatedVote = await Vote.create({
        userId,
        targetId: postId,
        targetType: "Post",
        type: action,
      });

      await Post.updateOne(
        { _id: postId },
        {
          $inc: {
            upvoteCount: action === "upvote" ? 1 : 0,
            downvoteCount: action === "downvote" ? 1 : 0,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Vote updated successfully",
      data: updatedVote,
    });

  } catch (error) {
    console.error("Error voting on post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while voting post",
    });
  }
}


/**
 * @desc    Handle Vote for a post
 * @route   PATCH /:commentId/vote
 * @access  Private
 */
export async function commentVote(req, res) {
  try {
    const userId = req.user?._id;
    const { commentId } = req.params;
    const { action } = req.body; // "upvote" | "downvote"

    // 1. Validate action
    if (!["upvote", "downvote"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote action",
      });
    }

    // 2. Fetch comment
    const comment = await Comment.findById(commentId).exec();
    if (!comment || comment.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "Cannot vote on this comment",
      });
    }

    // 3. Fetch parent post (to respect orphaned / deleted rules)
    const post = await Post.findById(comment.postId).exec();
    if (!post || post.isDeleted || post.isOrphaned) {
      return res.status(403).json({
        success: false,
        message: "Cannot vote on this comment",
      });
    }

    // 4. Find existing vote
    const existingVote = await Vote.findOne({
      userId,
      targetId: commentId,
      targetType: "Comment",
    }).exec();

    let updatedVote = null;

    /**
     * CASE 1: Existing vote
     */
    if (existingVote) {
      // Toggle same vote → remove
      if (existingVote.type === action) {
        await existingVote.deleteOne();
      }
      // Switch vote
      else {
        await Vote.updateOne(
          { _id: existingVote._id },
          { $set: { type: action } }
        );

        updatedVote = { ...existingVote.toObject(), type: action };
      }
    }

    /**
     * CASE 2: First-time vote
     */
    else {
      updatedVote = await Vote.create({
        userId,
        targetId: commentId,
        targetType: "Comment",
        type: action,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment vote updated successfully",
      data: updatedVote,
    });

  } catch (error) {
    console.error("Error voting on comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while voting comment",
    });
  }
}
