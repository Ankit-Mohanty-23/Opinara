import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmails.js";

/**
 * @desc    Create new User
 * @route   POST /user/signup
 * @access  Public
 */

export async function signup(req, res) {
  try {
    const { email, fullname, password } = req.body;
    if (!email || !fullname || !password) {
      return res.status(400).json({
        msg: "Please provide email, fullName and password correctly",
      });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        msg: "User already exits",
      });
    }
    const newUser = await new Users({
      email,
      fullname,
      password,
    }).save();

    res.status(201).json({
      msg: "New User Created",
      newUser
    });
  } catch (error) {
    res.status(500).json({
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
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide email and password correctly",
      });
    }
    const user = await Users.findOne({ email }).select("+password");
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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

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

    if (!userId) {
      res.status(400).json({
        msg: "Id not found",
      });
    }

    const UserData = await Users.findOne({ _id: userId });

    if (!UserData) {
      res.status(400).json({
        msg: "User Data not found",
      });
    }

    res.status(200).json({
      data: UserData,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Server error: Error in getUser API",
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
    
    if (!email || !fullname) {
      res.status(400).json({
        msg: "Please provide email and name correctly",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("sending email.."); // 6-digit OTP
    const sentEmail = await sendMail(fullname, email, otp);

    if (!sentEmail) {
      return res.status(500).json({
        msg: "Failed to send verification email",
        email,
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

export async function addBio (req, res) {
  try {
    const userId = req.user?._id;
    const { bio } = req.body;

    if(!bio){
      return res.status(404).json({
        success: false,
        msg: "Please provide bio",
      });
    }else if(!userId){
      return res.status(404).json({
        success: false,
        msg: "Please provide user id",
      });
    }

    const newBio = await Users.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    )

    if(!newBio){
      return res.status(404).json({
        success: false,
        msg: "No user found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "User bio updated",
    });
  }catch(error){
    res.status(500).json({
      msg: "Error adding Bio",
      error: error.message
    })
  }
}

/**
 * @desc    Add profile picture
 * @route   POST /user/profile-pic
 * @access  Public
 */


