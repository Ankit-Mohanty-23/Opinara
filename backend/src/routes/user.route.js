import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  login,
  signup,
  getUser,
  sendOtp,
  addBio,
  addProfilePic,
  deleteUser,
} from "../controller/user.controller.js";
import {
  loginSchema,
  signupSchema,
  getUserIdSchema,
  getOtpSchema,
  getBioSchema,
  profilepicSchema,
} from "../validation/user.validation.js";
import { validate, validateFile } from "../middleware/validate.middleware.js";

const Router = express.Router();

// Public
Router.post("/signup", validate(signupSchema), signup);
Router.post("/login", validate(loginSchema), login);

// Protected
Router.post("/verify", validate(getOtpSchema), sendOtp);
Router.get("/data", auth, validate(getUserIdSchema), getUser);
Router.delete("/delete", auth, validate(getUserIdSchema), deleteUser);
Router.put("/bio", auth, validate(getBioSchema), addBio);
Router.patch(
  "/profile-pic",
  auth,
  upload.single("profilePic"),
  validateFile(profilepicSchema),
  addProfilePic
);

export default Router;
