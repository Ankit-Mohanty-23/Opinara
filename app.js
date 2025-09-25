import express from "express";
import LoginRouter from "./routes/userRoutes.js"
import postRouter from "./routes/postRoutes.js"
import logger from "./logger.js";

console.log = (...args) => logger.info(args.join(" "))
console.error = (...args) => logger.error(args.join(" "));

const app = express();
app.use(express.json());

app.use('/user', LoginRouter);
app.use('/post', postRouter);

export default app;