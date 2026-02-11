import Membership from "../models/membership.model.js";
import Post from "../models/post.model.js";
import Wave from "../models/wave.model.js";
import Comment from "../models/comment.model.js";
import { asyncHandler } from "../util/asyncHandler.js";
import AppError from "../util/AppError.js";
import mongoose from "mongoose";
import logModerationEvent from "../services/moderationLog.service.js";

/**
 * @desc    Create new wave-user connection
 * @route   POST /member/create/:waveId
 * @access  Public
 */

export const setMembership = asyncHandler(async (req, res) => {

    const { waveId } = req.params;
    const memberId = req.user._id;

    const session = await mongoose.startSession();

    try {

        let createdMember;

        await session.withTransaction(async () => {

            const membership = await Membership.findOne({
                userId: memberId,
                waveId,
            }).session(session);

            if (membership?.status === "banned") {
                throw new AppError(
                    "You are banned from this wave",
                    403
                );
            }

            if (membership &&
                ["removed", "left"].includes(membership.status)) {

                membership.status = "active";
                membership.leftAt = null;
                membership.moderation = null;

                await membership.save({ session });

                await logModerationEvent({
                    session,
                    waveId,
                    actorId: memberId,
                    targetId: memberId,
                    action: "JOIN",
                    metadata: { rejoin: true }
                });

                return res.status(200).json({
                    success: true,
                    message: "Rejoined wave",
                });
            }

            if (membership?.status === "active") {
                return res.status(200).json({
                    success: true,
                    message: "Already a member",
                });
            }

            createdMember = await Membership.create([{
                userId: memberId,
                waveId,
                role: "member",
            }], { session });

            await logModerationEvent({
                session,
                waveId,
                actorId: memberId,
                targetId: memberId,
                action: "JOIN"
            });

        });

        session.endSession();

        return res.status(201).json({
            success: true,
            data: createdMember[0].status,
        });

    } catch (error) {

        session.endSession();
        throw error;
    }
});

/**
 * @desc    Ban a member by admin
 * @route   POST /member/banned/:waveId/:memberId
 * @access  Public
 */

export const banMembership = asyncHandler(async (req, res) => {
    const { waveId, memberId } = req.params;
    const actingUserId = req.user._id; 

    const ROLE_PRIORITY = {
        admin: 3,
        moderator: 2,
        member: 1,
    };

    const session = await mongoose.startSession();
    
    try{
        await session.withTransaction(async () => {

            const actingMember = await Membership.findOne({
                waveId,
                userId: actingUserId,
                status: "active",
            }).session(session);
        
            if(!actingMember){
                throw new AppError("Not a wave member", 403);
            }

            const targetMember = await Membership.findOne({
                waveId,
                userId: memberId,
                status: "active",
            }).session(session);

            if(!targetMember){
                throw new AppError("Member not found", 404);
            }

            if(ROLE_PRIORITY[actingMember.role] <= ROLE_PRIORITY[targetMember.role]){
                throw new AppError("You cannot ban a user with equal or higher role", 403);
            }

            targetMember.status = "banned";
            targetMember.moderation = {
                actionBy: actingUserId,
                actionAt: new Date(),
                actionType: req.body.actionType || "other",
                actionReason: req.body.actionReason || null,
            };            

            await targetMember.save({ session });

            await logModerationEvent({
                session,
                waveId,
                actorId: actingUserId,
                targetId: memberId,
                action: "BAN",
                metadata: {
                    actionType: req.body.actionType || "other",
                    actionReason: req.body.actionReason || null,
                }
            });            

        });

        await session.endSession();

        return res.status(200).json({
            success: true,
            message: "Member banned successfully",
        });
    }catch(error){
        await session.endSession();
        throw error;
    }
});

/**
 * @desc    temporarily remove member
 * @route   POST /member/remove/:waveId/:memberId
 * @access  Public
 */

export const removeMembership = asyncHandler(async (req, res) => {
    const { memberId, waveId } = req.params;
    const actingUserId = req.user._id;

    const ROLE_PRIORITY = {
        admin: 3,
        moderator: 2,
        member: 1
    };

    const session = await mongoose.startSession();

    try{
        await session.withTransaction(async () => {
            
            const actingMember = await Membership.findOne({
                waveId,
                userId: actingUserId,
                status: "active"
            }).session(session);

            if(!actingMember){
                throw new AppError("Not a member of wave", 403);
            }

            if(ROLE_PRIORITY[actingMember.role] < 2){
                throw new AppError("Insufficient permissions", 403);
            }

            const targetMember = await Membership.findOne({
                waveId,
                userId: memberId,
                status: "active",
            }).session(session);

            if(!targetMember){
                throw new AppError("Member not found or already inactive", 404);
            }

            if(actingUserId.equals(memberId)){
                throw new AppError("Use leave wave instead");
            }

            if(ROLE_PRIORITY[actingMember.role] <= ROLE_PRIORITY[targetMember.role]){
                throw new AppError("Cannot remove a user with equal or higher role", 403);
            }

            targetMember.status = "removed";
            targetMember.moderation = {
                actionBy: actingUserId,
                actionAt: new Date(),
                actionType: req.body.actionType || "other",
                actionReason: req.body.actionReason || null,
            };

            await targetMember.save({ session });

            await logModerationEvent({
                session,
                waveId,
                actorId: actingUserId,
                targetId: memberId,
                action: "REMOVE",
                metadata: {
                    actionType: req.body.actionType || "other",
                    actionReason: req.body.actionReason || null,
                }
            });
            
        });

        await session.endSession();

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });

    }catch(error){
        await session.endSession();
        throw error;
    }
});

/**
 * @desc    Member leaves voluntarily
 * @route   POST /member/leave/:waveId
 * @access  Public
 */

export const leaveMembership = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const waveId = req.params.waveId;

    const session = await mongoose.startSession();

    try{
        await session.withTransaction(async () => {
            const membership = await Membership.findOne({
                waveId,
                userId,
                status: "active",
            }).session(session);


            if(!membership){
                throw new AppError("You are not a member of wave", 404);
            }

            if(membership.role === "admin"){
                const adminCount = await Membership.countDocuments({
                    waveId,
                    role: "admin",
                    status: "active",
                }).session(session);

                if(adminCount <= 1){
                    throw new AppError("Transfer ownership before leaving the wave", 400);
                }
            }

            const hasPost = await Post.exists({ waveId, userId })
            .session(session);
            
            const hasComments = await Comment.exists({ userId })
            .session(session);

            const hasContribution = hasPost || hasComments;

            if(!hasContribution){
                await Membership.deleteOne({
                    _id: membership._id
                }).session(session);

                await logModerationEvent({
                    session,
                    waveId,
                    actorId: userId,
                    targetId: userId,
                    action: "LEAVE_PERMANENT",
                });

                return res.status(200).json({
                    success: true,
                    message: "you have left the wave permanently",
                });
            }

            membership.status = "left";
            membership.leftAt = new Date();
            membership.moderation = null;

            await membership.save({ session });

            await logModerationEvent({
                session,
                waveId,
                actorId: userId,
                targetId: userId,
                action: "LEAVE",
            });
            
        });

        await session.endSession();

        return res.status(201).json({
            success: true,
            message: "you have left the wave",
        });

    }catch(error){
        await session.endSession();
        throw error;
    }
});

/**
 * @desc    Member status change by Admin
 * @route   PATCH /waves/:waveId/transfer-admin/:memberId
 * @access  Public
 */

export const transferAdmin = asyncHandler(async (req, res) => {
    const actingUserId = req.user._id;
    const { waveId, memberId } = req.params;

    if (actingUserId.equals(memberId)) {
        throw new AppError("You are already the owner", 400);
    }

    const session = await mongoose.startSession();

    try {

        await session.withTransaction(async () => {

            const wave = await Wave.findById(waveId).session(session);

            if (!wave) {
                throw new AppError("Wave not present", 404);
            }

            if (!wave.owner.equals(actingUserId)) {
                throw new AppError("Only the owner can transfer admin", 403);
            }

            const actingMembership = await Membership.findOne({
                waveId,
                userId: actingUserId,
                role: "admin",
                status: "active"
            }).session(session);

            if (!actingMembership) {
                throw new AppError("Owner is not an active admin", 403);
            }

            const targetMember = await Membership.findOne({
                userId: memberId,
                waveId,
                status: "active"
            }).session(session);

            if (!targetMember) {
                throw new AppError("Target is not an active member", 404);
            }

            if (targetMember.role === "admin") {
                throw new AppError("User is already admin", 400);
            }

            actingMembership.role = "member";
            await actingMembership.save({ session });

            targetMember.role = "admin";
            await targetMember.save({ session });

            wave.owner = memberId;
            await wave.save({ session });

            await logModerationEvent({
                session,
                waveId,
                actorId: actingUserId,
                targetId: memberId,
                action: "TRANSFER_ADMIN",
            });            

        });

        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Ownership transferred successfully",
        });

    } catch (error) {

        session.endSession();
        throw error;
    }
});

/**
 * @desc    Promote/Demote member status to moderator status
 * @route   PATCH /waves/:waveId/members/:memberId/role
 * @access  Public
 */

export const updateModeratorRole = asyncHandler(async (req, res) => {
    const { waveId, memberId } = req.params;
    const userId = req.user?._id;
    const { role } = req.body;
    
    const session = await mongoose.startSession();
    let updatedMember, previousRole;

    try{
        await session.withTransaction(async () => {
            const wave = await Wave.findById(waveId).session(session);

            if(!wave){
                throw new AppError("Wave not found", 404);
            }

            if(!wave.owner.equals(userId)){
                throw new AppError("Only the admin can change moderator roles", 403);
            }

            const targetMember = await Membership.findOne({
                waveId,
                userId: memberId,
                status: "active",
            }).session(session);

            if (!targetMember) {
                throw new AppError("Member not found", 404);
            }
             
            if (wave.owner.equals(memberId) || targetMember.role === "admin") {
                throw new AppError("Admin/Owner role cannot be modified", 400);
            }

            if (targetMember.role === role) {
                throw new AppError("User already has this role", 400);
            }

            previousRole = targetMember.role;

            targetMember.role = role;
            await targetMember.save({ session });

            await logModerationEvent({
                session,
                waveId,
                actorId: userId,
                targetId: memberId,
                action: "ROLE_UPDATE",
                metadata: {
                    from: previousRole,
                    to: role,
                }
            });            

            updatedMember = targetMember;
        })

        await session.endSession();

        return res.status(200).json({
            success: true,
            data: {
                new: updatedMember.role,
                old: previousRole.role,
            }
        });

    }catch(error){
        await session.endSession();
        throw error;
    }
})