import mongoose from "mongoose";

const waveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: function () {
        return `Welcome to ${this.name}'s wave.`;
      },
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [1000, "Summary cannot exceed 1000 characters"],
    },
    coverImage: {
      type: {
        url: { type: String, trim: true },
        public_id: { type: String, trim: true },
      },
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membersCount: {
      type: Number,
      default: 1,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
      },
      coordinates: {
        type: [Number],
        default: null,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

waveSchema.index(
  { name: 1, isDeleted: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 }
  }
);
waveSchema.index(
  { createdAt: -1 },
  { partialFilterExpression: { isDeleted: false } }
);

export default mongoose.model("Wave", waveSchema);
