import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.instanceof(mongoose.Types.ObjectId);

/**
 * Set Membership
 */

export const setMemberSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
    }),
};

/**
 * Ban Membership
 */

export const banMemberSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
        memberId: objectIdSchema,
    }),
};

/**
 * Remove Membership
 */

export const removeMemberSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
        memberId: objectIdSchema,
    }),
};

/**
 * Leave Membership
 */

export const leaveMemberSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
    }),
};

/**
 * Transfer Admin Membership
 */

export const transferAdminSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
        memberId: objectIdSchema,
    }),
};

/**
 * Update Moderator Role
 */

export const updateModeratorSchema = {
    user: z.object({
        _id: objectIdSchema,
    }),

    params: z.object({
        waveId: objectIdSchema,
        memberId: objectIdSchema,
    }),

    body: z.object({
        role: z.string().min(1, "required member role i.e. Admin, Moderator or Member"),
    }),
};