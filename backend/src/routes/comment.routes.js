import express from "express";
import { createComment, getRootComments, getReplies } from "../controller/comment.controller.js";
import { createCommentSchema, getCommentSchema, getRepliesSchema, deleteCommentSchema } from "../validation/comment.validation.js";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

const Router = express.Router();

Router.post("/:postId/comment", auth, validate(createCommentSchema), createComment);
Router.get("/:postId/comments", auth, validate(getCommentSchema), getRootComments);
Router.get("/:commentId/comments", auth, validate(getRepliesSchema), getReplies);
Router.delete("/:commentId/delete", auth, validate(deleteCommentSchema), deleteComment);

export default Router;