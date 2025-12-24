import Comment from "../models/comment.model.js";
import Vote from "../models/vote.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import checkToxicity from "../../Llama-setup/toxicity-check.js";

/**
 * @desc    Create new post
 * @route   POST /:waveId/create-post
 * @access  Private
 */

export async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req.user?._id;
    const { waveId } = req.params || {};

    let media = [];
    if (req.files && req.files.length > 0) {
      media = req.files.map((file) => ({
        url: file.path,
        type: file.mimetype.startsWith("video") ? "video" : "image",
        public_id: file.filename || file.public_id,
      }));
    }

    const response = await Post.create({
      userId,
      waveId,
      title,
      content,
      media,
    });

    return res.status(201).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error("Error creating post: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating post",
    });
  }
}

/**
 * @desc    Get all posts
 * @route   GET /posts?page=1
 * @access  Public
 */

export async function getAllPosts(req, res) {
  try {
    const userId = req.user?._id;
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1)*limit;

    const posts = await Post.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip).limit(limit)
    .select("title content media upvoteCount downvoteCount commentCount")
    .lean().exec();

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Posts not found! ",
      });
    }

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error getting all posts: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching posts",
    });
  }
}

/**
 * @desc    Get any specific post
 * @route   GET /:postId
 * @access  Public
 */

export async function getPost(req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
    .select("title content media upvotesCount downvoteCount commentCount isDeleted")
    .lean().exec();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found! ",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
    
  } catch (error) {
    console.error("Error getting post: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching post",
    });
  }
}

/**
 * @desc    Delete a post
 * @route   DELETE post/:postId
 * @access  Private
 */

export async function deletePost(req, res) {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    const post = await Post.findById(postId).exec();

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Invalid User, You are not allowed to delete this post",
      });
    }

    const [commentCount, voteCount] = await Promise.all([
      Comment.countDocuments({ postId }),
      Vote.countDocuments({ targetId: postId, targetType: "Post" }),
    ]);

    const hasEngagement = commentCount > 0 || voteCount > 0;
    
    //hard delete a post
    if(!hasEngagement){
       //Delete all media files from Cloudinary
      if (post.media && post.media.length > 0) {
        for (const item of post.media) {
          if (item.public_id) {
            await cloudinary.uploader.destroy(item.public_id, {
              resource_type: item.type === "video" ? "video" : "image",
            });
          }
        }
      }

      await Post.deleteOne({ _id: postId });
      await Comment.deleteMany({ postId })

      return res.status(200).json({
        success: true,
        message: "Post deleted by user"
      });
    }

    const now = new Date();

    await Post.updateOne(
      { _id: postId },
      { $set: { isdeleted: true, deletedAt: now } },
    );

    await Comment.updateOne(
      { postId, isDeleted: false },
      { $set: { isdeleted: true, deletedAt: now } },
    );
    
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    console.log("Error deleting post: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting post",
    });
  }
}

/**
 * @desc    strict toxicity classifier
 * @route   POST post/:postId/classify
 * @access  Public
 */

export async function classifier(req, res) {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found for classifying!",
      });
    }

    const title = post.title;
    const context = post.content;

    const titleResult = await checkToxicity(title);
    const contextResult = await checkToxicity(context);

    if (!contextResult && !titleResult) {
      return res.status(400).json({
        success: false,
        message: `Classification failed for ${title}`,
      });
    }

    res.status(200).json({
      success: true,
      class: contextResult,
    });

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while classifying post",
    });
  }
}
