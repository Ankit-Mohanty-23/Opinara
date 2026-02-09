import mongoose from "mongoose";

const moderationLogSchema = new mongoose.Schema(
  {
    waveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wave",
      required: true,
      index: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "JOIN",
        "LEAVE",
        "BAN",
        "UNBAN",
        "REMOVE",
        "ROLE_CHANGED",
        "TRANSFER_OWNERSHIP",
        "WAVE_DELETED",
      ],
      required: true,
      index: true,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

/**
 ✅ MOST IMPORTANT INDEX
 Optimized for:
 "Show recent moderation activity in a wave"
*/
moderationLogSchema.index({
  waveId: 1,
  createdAt: -1,
});

/**
 Optional but VERY powerful later:
 Track moderator behavior
*/
moderationLogSchema.index({
  actorId: 1,
  createdAt: -1,
});

export default mongoose.model("ModerationLog", moderationLogSchema);
