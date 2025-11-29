import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    avatar: {
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
    karma: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// comparing hassed passwords
userSchema.methods.comparePassword = async function (testpassword) {
  try {
    return await bcrypt.compare(testpassword, this.password);
  } catch (err) {
    throw err;
  }
};

// Save readable timestamps
userSchema.pre("save", function (next) {
  const readable = new Date().toLocaleString("en-IN", {
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  // If document newly created
  if (!this.createdAt) this.createdAt = readable;

  // Always update updatedAt
  this.updatedAt = readable;

  next();
});

const Users = mongoose.model("Users", userSchema);
export default Users;
