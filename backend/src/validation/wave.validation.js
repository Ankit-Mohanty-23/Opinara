import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.instanceof(mongoose.Types.ObjectId);
const waveNameRegex = /^[a-z0-9._]+$/;

/**
 * Create Wave
 */
export const createWaveSchema = {
  body: z.object({
    name: z
      .string()
      .min(1, "Wave name is required")
      .regex(
        waveNameRegex,
        "Wave name can contain only lowercase characters, numbers, underscore (_) and dot (.) with no spaces",
      ),
    description: z.string().trim().optional(),
  }),
  user: z.object({
    _id: objectIdSchema,
  }),
};

/**
 * update Wave Cover Image
 */

export const CoverImageSchema = {
  params: z.object({
    waveId: objectIdSchema,
  }),

  user: z.object({
    _id: objectIdSchema,
  }),
};

/**
 * Get Wave Posts
 * /waves/:waveId/posts?page=1&limit=10
 */
export const getWavePostSchema = {
  user: z.object({
    _id: objectIdSchema,
  }),

  params: z.object({
    waveId: objectIdSchema,
  }),

  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
};

/**
 * Update Location
 */
export const getLocationSchema = {
  params: z.object({
    waveId: objectIdSchema,
  }),

  user: z.object({
    _id: objectIdSchema,
  }),

  body: z.object({
    longitude: z
      .number({
        required_error: "Longitude is required",
        invalid_type_error: "Longitude must be a number",
      })
      .min(-180, "Longitude must be >= -180")
      .max(180, "Longitude must be <= 180"),

    latitude: z
      .number({
        required_error: "Latitude is required",
        invalid_type_error: "Latitude must be a number",
      })
      .min(-90, "Latitude must be >= -90")
      .max(90, "Latitude must be <= 90"),
  }),
};

/**
 * Get User Waves
 * /waves/user-wave?page=1&limit=10
 */
export const getWavesSchema = {
  user: z.object({
    _id: objectIdSchema,
  }),

  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
  }),
};

/**
 * Search Waves
 * /waves/search?q=react
 */
export const SearchWaveSchema = {
  query: z.object({
    q: z
      .string()
      .min(1, "Search query is required")
      .max(50, "Search query too long")
      .trim(),

    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
  }),
};

/**
 * Delete Wave
 */
export const deleteWaveSchema = {
  params: z.object({
    waveId: objectIdSchema,
  }),

  user: z.object({
    _id: objectIdSchema,
  }),
};

/**
 * Get Members
 * /waves/:waveId/members?page=1&limit=20&role=moderator&status=active&search=ankit
 */
export const getMembersSchema = {
  params: z.object({
    waveId: objectIdSchema,
  }),

  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),

    role: z.enum(["member", "moderator", "admin"]).optional(),

    status: z.enum(["active", "left", "banned", "removed"]).optional(),

    search: z.string().max(50).trim().optional(),
  }),
};
