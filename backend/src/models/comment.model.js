import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    vote: {
      type: Number,
      default: 0,
      index: true,
    },    
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,  
    },
  },
  { timestamps: true }
);

commentSchema.index({
  postId: 1,
  parentCommentId: 1,
  isDeleted: 1,
  createdAt: -1,
  _id: -1,
});

commentSchema.index({
  postId: 1,
  parentCommentId: 1,
  isDeleted: 1,
  vote: -1,
  createdAt: -1,
});

commentSchema.index({
  parentCommentId: 1,
  isDeleted: 1,
  createdAt: -1,
  _id: -1,
});


export default mongoose.model("Comment", commentSchema);
