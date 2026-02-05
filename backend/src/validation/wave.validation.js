import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.instanceof(mongoose.Types.ObjectId);
const waveNameRegex = /^[a-z0-9._]+$/;

export const createWaveSchema = {
    body: z.object({
        name: z
            .string()
            .min(1, "Wave name is required")
            .regex(
                waveNameRegex,
                "Wave name can contain only small character, numbers, underscore (_) and dot (.) with no spaces"
            ),
        description: z.string().trim().optional(),
    }),
    user: z.object({
        _id: objectIdSchema,
    }),
};

export const getWavePostSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
    }),
};

export const getLocationSchema = {
    params: z.object({
        waveId: objectIdSchema,
    }),

    user: z.object({
        _id: objectIdSchema,
    }),

    body: z.object({
        latitude: z.number({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a number",
        })
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180"),

        latitude: z.number({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a number",
        })
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90"),
    }),
};