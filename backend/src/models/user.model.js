import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define user schema
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      default: "Custom Signup",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
    },
    wave: [
      {
        type: String,
        default: null,
      },
    ],
    profile_pic: {
      type: {
        type: String,
        enum: ["image"],
      },
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    bio: {
      type: String,
      trim: true,
      default: null,
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
  {
    timestamps: true,
  }
);

// Password hashing: error handling and guard
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare hashed password
userSchema.methods.comparePassword = async function (testpassword) {
  try {
    return await bcrypt.compare(testpassword, this.password);
  } catch (err) {
    throw err;
  }
};

userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);
export default User;
