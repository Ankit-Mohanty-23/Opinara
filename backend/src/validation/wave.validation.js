import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine(
    (id) => mongoose.Schema.Types.ObjectId(id), {
        message: "Invalid ObjectId format",
    }
);

export const createWaveSchema = {
    body: z.object({
        name: z.string().trim().min(1, "Wave name is required"),
        description: z.string().trim(),
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