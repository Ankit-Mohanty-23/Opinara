import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  login,
  signup,
  getUser,
  SendOtp,
  addBio,
} from "../controller/user.controller.js";

const Router = express.Router();

Router.post("/signup", signup);
Router.post("/login", login);
Router.post("/verify", SendOtp);
Router.get("/data", auth, getUser);
Router.put("/bio", auth, addBio);

export default Router;
