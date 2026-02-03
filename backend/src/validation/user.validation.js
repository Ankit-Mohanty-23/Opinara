import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId format",
  });

export const signupSchema = {
  body: z.object({
    email: z.string().trim().min(1, "Email is required"),
    fullname: z.string().trim().min(1, "fullname is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().email("Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
};

export const getUserIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),
});

export const getOtpSchema = {
  body: z.object({
    email: z.string().trim().email("Valid Email is required"),
    fullname: z.string().trim().min(1, "Full name required"),
  }),
};

export const getBioSchema = {
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),

  body: z.object({
    bio: z
      .string()
      .trim()
      .min(1, "Bio is required")
      .max(100, "Bio exceeded limit"),
  }),
};

export const profilepicSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),

  file: z.object({
    originalname: z.string(),
    mimetype: z.enum(["image/jpeg", "image/png", "image/webp"]),
    size: z.number().max(5 * 1024 * 1024),
  }),
});
