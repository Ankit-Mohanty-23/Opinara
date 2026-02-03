import passport from "passport";
import express from "express";
import auth from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @desc   Start Google Login (Redirect to Google)
 * @route  GET /auth/google
 * @access Public
 */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @desc   Google callback URL (After Google Auth)
 * @route  GET /auth/google/callback
 * @access Public
 */

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/auth/fail");
    }

    const payload = {
      id: req.user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_WEEK_MS,
    });

    const url = process.env.BACKEND_URL;
    return res.redirect(`${url}/auth/profile`);
  }
);

/**
 * @desc   Login failed response
 * @route  GET /auth/fail
 * @access Public
 */

router.get("/fail", (req, res) => {
  res.status(401).json({
    success: false,
    message: "login Failure",
  });
});

/**
 * @desc   Profile Route - Get Logged In User
 * @route  GET /auth/profile
 * @access Protected (Needs JWT cookie)
 */

router.get("/profile", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Profile",
    user: req.user,
  });
});

/**
 * @desc   Logout User (Clear JWT Cookie)
 * @route  GET /auth/logout
 * @access Public
 */
router.get("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.redirect(`${process.env.BACKEND_URL}/auth/logout-redirect`);
});

router.get("/logout-redirect", (req, res) => {
  res.send("Profile Logout");
});

export default router;
