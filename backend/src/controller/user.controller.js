import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendMail from "../services/sendEmails.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Vote from "../models/vote.model.js";

/**
 * @desc    Create new User
 * @route   POST /user/signup
 * @access  Public
 */

export async function signup(req, res) {
  try {
    const { email, fullname, password } = req.body;
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "User already exits",
      });
    }
    const newUser = await new User({
      googleId: "Custom Signup",
      email,
      fullname,
      password,
    }).save();

    res.status(201).json({
      success: true,
      msg: "New User Created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Signup Failed",
      error: error.message,
    });
  }
}

/**
 * @desc    Get Login
 * @route   POST /user/login
 * @access  Public
 */

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // Always cast password to string before comparing
    const isPasswordValid = await user.comparePassword(String(password));
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Login Failed",
      error: error.message,
    });
  }
}

/**
 * @desc    Get user details
 * @route   GET /user/data
 * @access  Public
 */

export async function getUser(req, res) {
  try {
    const userId = req.user?._id;

    const UserData = await User.findOne({ _id: userId });

    if (!UserData) {
      return res.status(404).json({
        success: false,
        msg: "User Data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: UserData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error: Error in getUser API",
      error: error.message,
    });
  }
}

/**
 * @desc    Get email verification
 * @route   POST /user/verify
 * @access  Public
 */

export async function SendOtp(req, res) {
  try {
    const { email, fullname } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("sending email.."); // 6-digit OTP
    const sentEmail = await sendMail(fullname, email, otp);

    if (!sentEmail.success) {
      return res.status(500).json({
        success: false,
        msg: sentEmail.message,
        error: sentEmail.error,
        mail: email,
      });
    }

    res.status(200).json({
      msg: "Verification email sent successfully",
      otp: otp,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error: Error in verification API",
      error: error,
    });
  }
}

/**
 * @desc    Add bio for profile
 * @route   POST /user/bio
 * @access  Public
 */

export async function addBio(req, res) {
  try {
    const userId = req.user?._id;
    const { bio } = req.body;

    const newBio = await User.findByIdAndUpdate(userId, { bio }, { new: true });

    if (!newBio) {
      return res.status(404).json({
        success: false,
        msg: "No user found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "User bio updated",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error adding Bio",
      error: error.message,
    });
  }
}

/**
 * @desc    Add profile picture
 * @route   POST /user/profile-pic
 * @access  Protected
 */

export async function addProfilePic(req, res) {
  try {
    const userId = req.user?._id;
 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (user.profile_pic?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profile_pic.public_id);
      } catch (cloudinaryError) {
        console.error("Error deleting old profile picture:", cloudinaryError);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profile_pic: {
          type: "image",
          url: req.file.path,
          public_id: req.file.filename || req.file.public_id,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: "Failed to update profile picture",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Profile picture updated successfully",
      profile_pic: updatedUser.profile_pic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating profile picture",
      error: error.message,
    });
  }
}

/**
 * @desc    Add profile picture
 * @route   POST /user/profile-pic
 * @access  Protected
 */

export async function deleteUser(req, res){
  try{
    const userId = req.user?._id;
    
    const user = await User.findById(userId);
    if(!user || user.isDeleted){
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [ postCount, commentCount, voteCount ] = await Promise.all([
      Post.countDocuments({ userId }),
      Comment.countDocuments({ userId }),
      Vote.countDocuments({ userId }),
    ]);

    const hasActivity = postCount > 0 || commentCount > 0 || voteCount > 0;

    /**
   * CASE 1: No activity → Hard delete
   */

    if(!hasActivity){
      await User.findByIdAndDelete({ _id: userId });

      return res.status(200).json({
        success: true,
        message: "User account permanently deleted",
      });
    }

    /**
   * CASE 2: Has activity → Soft delete + cascade hide
   */

    const now = new Date();

    user.isDeleted = true;
    user.deletedAt = now;
    await user.save();

    await Post.updateMany(
      { userId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: now } }
    );

    await Comment.updateMany(
      { userId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: now } }
    );

    return res.status(200).json({
      success: true,
      message: "User account is deleted successfully",
    });

  }catch(error){
    console.error("Error deleting user: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting user account",
    });
  }
}