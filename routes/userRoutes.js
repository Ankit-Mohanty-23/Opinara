import express from "express";
import auth from "../middleware/auth.js";
import { login, signup, getUser, SendOtp, addBio } from "../controller/userController.js";

const Router = express.Router();

Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/verify', SendOtp);
Router.get('/data', auth, getUser);
Router.put('/bio', auth, addBio);


export default Router;
