import express from "express";
import LoginRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import logger from "./util/logger.js";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import setupPassport from "./services/passport.service.js";
import authRouter from "./controller/google.auth.controller.js";
import waveRouter from "./routes/wave.route.js";
import commentRouter from "./routes/comment.routes.js";
import voteRouter from "./routes/vote.routes.js";
import globalErrorHandler from "./middleware/error.middleware.js";

console.log = (...args) => logger.debug(args.join(" "));
console.error = (...args) => logger.error(args.join(" "));
console.info = (...args) => logger.info(args.join(" "));
console.warn = (...args) => logger.warn(args.join(" "));

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
setupPassport();

app.use("/user", LoginRouter);
app.use("/posts", postRouter);
app.use("/wave", waveRouter);
app.use("/wave", commentRouter);
app.use("/wave", voteRouter);
app.use("/auth", authRouter);

app.use(globalErrorHandler);

export default app;
