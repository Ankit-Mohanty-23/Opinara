import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    waveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wave",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "moderator"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "left", "banned", "removed"],
      default: "active",
      index: true,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    moderation:{
      actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      actionAt: {
        type: Date,
        default: null,
      },
      actionType: {
        type: String,
        enum: [
          "spam",
          "harassment",
          "hate_speech",
          "policy_violation",
          "other",
        ],
        default: null,
      },
      actionReason: {
        type: String,
        trim: true,
        maxLength: 500,
        default: null,
      },
    },   
  },
  { timestamps: true }
);

membershipSchema.index({ waveId: 1, userId: 1 }, { unique: true });
membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ waveId: 1, status: 1 });

export default mongoose.model("Membership", membershipSchema);
