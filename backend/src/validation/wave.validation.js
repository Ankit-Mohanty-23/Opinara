import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine(
    (id) => mongoose.Schema.Types.ObjectId(id), {
        message: "Invalid ObjectId format",
    }
);

export const createWaveSchema ={
    body: z.object({
        name: z.string().trim().min(1, "Wave name is required"),
        description: z.string().trim(),
    }),
    user: z.object({
        _id: objectIdSchema,
    }),
    
}