import mongoose from "mongoose";
import Wave from "../models/wave.model.js";
import Membership from "../models/membership.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../util/AppError.js";
import { asyncHandler } from "../util/asyncHandler.js";
//import { summarize } from "../../Llama-setup/summarizer.js";

/**
 * @desc    Create new wave
 * @route   POST /wave/create
 * @access  Public
 */

export const createWave = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const userId = req.user?._id;
    const { name, description } = req.body;

    const [wave] = await Wave.create([{
      name,
      description,
      createdBy: userId,
      owner: userId,
    }],
    { session }
  );

    await Membership.create(
      [{
        waveId: wave._id,
        userId,
        role: "admin",
      }],
      { session }
    )

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      data: wave,
    });

  }catch(error){

    if (error.code === 11000) {
      throw new AppError("Wave name already exists", 409);
    }

    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Update wave cover image
 * @route   PUT /waves/:waveId/cover-image
 * @access  Private (Owner only)
 */

export const updateWaveCoverImage = asyncHandler(async (req, res) => {

  const userId = req.user?._id;
  const { waveId } = req.params;

  let coverImage = null;

  if (req.file) {
    coverImage = {
      url: req.file.path,
      public_id: req.file.filename || req.file.public_id,
    };
  }

  if (!coverImage)
    throw new AppError("Cover image is required", 400);

  const session = await mongoose.startSession();

  try {

    let updatedCoverImage;

    await session.withTransaction(async () => {

      const wave = await Wave.findOne({
        _id: waveId,
        isDeleted: false
      }).session(session);

      if (!wave)
        throw new AppError("Wave not found", 404);

      if (wave.owner.toString() !== userId.toString())
        throw new AppError(
          "Only owner can update cover image",
          403
        );

      if (wave.coverImage?.public_id) {
        await cloudinary.uploader.destroy(
          wave.coverImage.public_id
        );
      }

      wave.coverImage = coverImage;
      await wave.save({ session });
      updatedCoverImage = wave.coverImage;

    });

    return res.status(200).json({
      success: true,
      data: updatedCoverImage
    });

  } catch (error) {

    if (coverImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          coverImage.public_id
        );
      } catch (cleanupError) {
        logger.error({
          message: "Cloudinary rollback failed",
          publicId: coverImage.public_id,
          error: cleanupError.message,
        });
      }
    }

    throw error;

  } finally {
    session.endSession();
  }

});

/**
 * @desc    Get the waves user have joined
 * @route   GET /user-waves
 * @access  Public
 */

export const getWaves = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const membership = await Membership.find({ 
    userId: userId,
    status: "active",
  }).populate({
    path: "wave",
    select: "name coverImage membersCount createdAt",
  }).lean();

  const waves = membership.map(m => m.waveId);

  res.status(200).json({
    success: true,
    count: waves.length,
    data: waves
  })
})

/**
 * @desc    Search for wave using name
 * @route   GET /wave/?q=wave-name
 * @access  Public
 */

export const SearchWave = asyncHandler(async (req, res) => {
  let { q } = req.query;

  if(!q || q.trim() === ""){
    return res.json({
      success: true,
      count: 0,
      data: [],
    })
  }

  q = q.toLowerCase().trim();

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const waves = await Wave.find({
    name:  { $regex: `^${escaped}` },
    isDeleted: false,
  })
    .select("name membersCount")
    .sort({ membersCount: -1})
    .limit(8)
    .lean();

    res.json({
      success: true,
      count: waves.length,
      data: waves
    });
})

/**
 * @desc    Get all posts of a wave
 * @route   GET /wave/:waveId/posts?page=1
 * @access  Public
 */

export const getWavePosts = asyncHandler(async (req, res) => {
  const { waveId } = req.params;

  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * 10;

  const posts = await Post.find({ waveId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(10)
    .select("title content media")
    .populate({
      path: "userId",
      select: "fullname profilePic",
    })
    .lean();

  if (posts.length === 0) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({
    success: true,
    page,
    data: posts,
  });
});

/**
 * @desc    Set Location for a wave
 * @route   GET /wave/location/:waveId
 * @access  Public
 */

export const getLocation = asyncHandler(async (req, res) => {
  const { waveId } = req.params;
  const { longitude, latitude } = req.body;
  const userId = req.user?._id;

  const wave = await Wave.findOne({
    _id: waveId,
    creadtedBy: userId,
  })
    .lean()
    .exec();

  if (!wave) {
    throw new AppError("Wave not found", 404);
  }

  wave.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };
  await wave.save();

  return res.status(200).json({
    success: true,
    location: wave.location,
  });
});

/**
 * @desc    Deleting a wave
 * @route   DELETE /wave/delete/:waveId
 * @access  Public
 */

export const deleteWave = asyncHandler(async (req, res) => {
  const { waveId } = req.params;
  const userId = req.user?._id;

  const session = await mongoose.startSession();
  const now = new Date();

  try {
    await session.withTransaction(async () => {

      const wave = await Wave.findById(waveId).session(session);

      if (!wave || wave.isDeleted) {
        throw new AppError("Wave not found", 404);
      }

      if (wave.owner.equals(userId)) {
        throw new AppError("Invalid user. You are not allowed to delete this wave",403);
      }

      const hasPost = await Post.exists({ waveId }).session(session);

      if (!hasPost) {
        await Membership.deleteMany(
          { waveId },
          { session }
        );

        await Wave.deleteOne(
          { _id: waveId }, 
          { session }
        );

        return res.status(200).json({
          success: true,
          message: "Wave permanently deleted (no posts found)",
        });
      }

      await Wave.updateOne(
        { _id: waveId },
        { $set: { isDeleted: true, deletedAt: now } },
        { session }
      );

      await Membership.updateMany(
        { waveId, status: "active" },
        {
          status: "removed",
          moderation: {
            actionBy: userId,
            actionAt: now,
            actionType: "wave_deleted",
            actionReason: "Wave was deleted by admin"
          }
        },
        { session }
      );
    });

    await session.endSession();

    return res.status(200).json({
      success: true,
      message: "Wave deleted and posts preserved as orphaned content",
    });

  } catch (error) {
    await session.endSession();
    throw error;
  }
});

/**
 * @desc    Get Wave Members
 * @route   GET /waves/:waveId/members
            ?page=1&limit=20&role=moderator&status=active&search=ankit
 * @access  Public
 */

export const getMembers = asyncHandler(async (req, res) => {
  const { waveId } = req.params.waveId;

  let{
    page = 1,
    limit = 20,
    role, 
    status = "active",
    search,
  } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.min(50, parseInt(limit));

  const filter = {
    waveId,
    ...(role && { role }),
    ...(status && { status })
  };

  if(search){
    const users = await User.find({
      name: { $regex: search, $options: "i" }
    }).select("_id");

    filter.userId = { $in: users.map(u => u._id) };
  }

  const members = await Membership.find(filter)
    .select("userId role status")
    .populate({
      path: "User",
      select: "fullname profile_pic bio"
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) *limit)
    .limit(limit)
    .lean();

    const total =  await Membership.countDocuments(filter);

    return res.status(200).json({
      success: true,
      page,
      totalPage: Math.ceil(total/limit),
      totalMembers: total,
      data: members
    });
});

/**
 * @desc    Summarization of content
 * @route   POST /wave/summarize
 * @access  Public
 */

// export async function summary(req, res) {
//   try {
//     const postId = req.params.postId;

//     const posts = await Wave.find({   });
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         msg: "Post not found for summary!",
//       });
//     }

//     const content = post.content;
//     const title = post.title;
//     const result = await summarize(content);
//     if (!result) {
//       return res.status(400).json({
//         success: false,
//         msg: `summary failed for ${title}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       summary: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       msg: "Failed in summaring the content",
//       error: error.message,
//     });
//   }
// }
