import Wave from "../models/wave.model.js";
import { V2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import summarize from "/Llama-setup/summarizer.js";

/**
 * @desc    Create new wave
 * @route   POST /wave/create
 * @access  Public
 */

export async function createWave(req, res) {
  try {
    const userId = req.user?._id;
    const { name, description } = req.body;
    
    const response = await Wave.create({
      name,
      description,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      data: response
    });

  } catch (error) {
    if(error.code === 11000){
      return res.status(409).json({
        success: false,
        message: "Wave name already exists",
      });
    }

    console.error("Error creating wave: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating wave",
    });
  }
}

/**
 * @desc    Get all posts
 * @route   GET /wave/:waveId/posts?page=1
 * @access  Public
 */

export async function getWavePosts(req, res) {
  try {
    const { waveId } = req.params;

    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 10;

    const posts = await Post.find({ waveId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10)
      .select("title content media") // field selection
      .populate({
        path: "userId",
        select: "fullname profilePic",
      }).lean();

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Posts not found!",
      });
    }

    res.status(200).json({
      success: true,
      page,
      data: posts,
    });

  } catch (error) {
    console.error("Error fetching wave post: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching wave post",
    });
  }
}

export async function getLocation(){
  try{ 
    const { waveId } = req.params;
    const { longitude, latitude } = req.body;
    const userId = req.user?._id;

    const wave = await Wave.findOne({
      _id: waveId,
      creadtedBy: userId,
    });

    if(!wave){
      return res.status(404).json({
        success: false,
        message: "Wave not found",
      });
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

  }catch(error){
    console.error("Error updating loaction to wave: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating location",
    });
  }
}

/**
 * @desc    Deleting a wave
 * @route   DELETE /wave/delete/:waveId
 * @access  Public
 */

export async function deleteWave(req, res){
  try{
    const { waveId } = req.params;
    const userId = req.user?._id;

    const wave = Wave.findById(waveId).exec();

    if(!wave || wave.isDeleted){
      return res.status(404).json({
        success: false,
        message: "Wave not found",
      });
    }

    if(wave.creadtedBy.toString() !== userId.toString()){
      return res.status(403).json({
        success: false,
        message: "Invalid user. You are not allowed to delete this wave",
      });
    }

    const postCount = await Post.countDocuments({ waveId });

    if(postCount === 0){
      await Wave.deleteOne({ _id: waveId });

      return res.status(200).json({
        success: true,
        message: "Wave permanently deleted (no posts found)",
      });
    }

    const now = new Date();

    await Wave.updateOne(
      { _id: waveId },
      { $set: { isDeleted: true, deletedAt: now } },
    );

    await Post.updateMany(
      { waveId },
      { $set: { waveId: null, isOrphaned: true } },
    );

    return res.status(200).json({
      success: true,
      message: "Wave deleted and posts preserved as orphaned content",
    });
  }catch(error){
    console.error("Error deleting wave: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting wave",
    });
  }
}

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
