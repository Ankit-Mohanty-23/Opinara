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
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (v) {
            // For Point type, coordinates must be [longitude, latitude]
            return (
              Array.isArray(v) &&
              v.length === 2 &&
              v[0] >= -180 && v[0] <= 180 &&
              v[1] >= -90 && v[1] <= 90
            );
          },
          message:
            "Coordinates must be [longitude, latitude]",
        },
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
    postCount: {
      type: Number,
      default: 0,
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
