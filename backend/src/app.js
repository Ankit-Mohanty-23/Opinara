import express from "express";
import LoginRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import setupPassport from "./services/passport.service.js";
import authRouter from "./controller/google.auth.controller.js";
import waveRouter from "./routes/wave.route.js";
import commentRouter from "./routes/comment.routes.js";
import voteRouter from "./routes/vote.routes.js";
import globalErrorHandler from "./middleware/error.middleware.js";
import healthRouter from "./routes/health.route.js";

const app = express();

/** System Routes */
app.use("/health", healthRouter);

/** Core Middleware */
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

/** Feature Routes */
app.use("/users", LoginRouter);
app.use("/posts", postRouter);
app.use("/waves", waveRouter);
app.use("/waves", commentRouter);
app.use("/waves", voteRouter);
app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/** Error Handler */
app.use(globalErrorHandler);

export default app;
