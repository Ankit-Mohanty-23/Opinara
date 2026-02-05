import Membership from "../models/membership.model.js";
import Post from "../models/Post.model.js";
import Comment from "../models/comment.model.js";
import { asyncHandler } from "../util/asyncHandler.js";
import AppError from "../util/AppError.js";
import mongoose from "mongoose";

/**
 * @desc    Create new wave-user connection
 * @route   POST /member/create/:waveId
 * @access  Public
 */

export const setMembership = asyncHandler(async (req, res) => {
    const { waveId } = req.params.waveId;
    const memberId = req.user._id;

    const membership = await Membership.findOne({
        userId: memberId,
        waveId,
    }).lean();

    if(membership?.status === "banned"){
        throw new AppError("You are banned from this wave", 403);
    }

    if(membership?.status === "removed" || membership?.status === "left"){
        membership.status = "active";
        membership.leftAt = null;
        membership.moderation = null;

        await membership.save();
        return res.status(200).json({
            success: true,
            message: "Rejoined wave,"
        });
    }

    if (membership?.status === "active") {
        return res.status(200).json({
            success: true,
            message: "Already a member",
        });
    }

    const member = await Membership.create({
        userId: memberId,
        waveId,
        role: "member",
    })

    return res.status(201).json({
        success: true,
        data: member.status,
    })
})

/**
 * @desc    Ban a member by admin
 * @route   POST /member/banned/:waveId/:target
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

        });

        await session.endSession();

        return res.status(200).json({
            success: true,
            message: "Member banned successfully",
        });
    }catch(error){
        session.endSession();
        throw error;
    }
});

/**
 * @desc    temporarily remove member
 * @route   POST /member/remove/:waveId/:target
 * @access  Public
 */

export const removeMember = asyncHandler(async (req, res) => {
    const { memberId, waveId } = req.params;
    const actingUserId = req.user._id;

    const ROLE_PRIORITY = {
        admin: 3,
        moderator: 2,
        member: 1
    };

    const session = mongoose.startSession();

    try{
        await session.withTransaction(async () => {
            
            const actingMember = await Membership.find({
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

            const targetMember = await Membership.find({
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
        });

        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });

    }catch(error){
        session.endSession();
        throw error;
    }
});

/**
 * @desc     Member leaves voluntarily
 * @route   POST /member/leave/:waveId
 * @access  Public
 */

export const leaveMember = asyncHandler(async (req, res) => {
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

            const hasContribution = hasPost || hasComment;

            if(!hasContribution){
                await Membership.deleteOne({
                    _id: membership._id
                }).session(session);

                return res.status(200).json({
                    success: true,
                    message: "you have left the wave permanently",
                });
            }

            membership.status = "left";
            membership.leftAt = new Date();
            membership.moderation = null;

            await membership.save({ session });
        });

        session.endSession();

        return res.status(201).json({
            success: true,
            message: "you have left the wave",
        });

    }catch(error){
        session.endSession();
        throw error;
    }
});

