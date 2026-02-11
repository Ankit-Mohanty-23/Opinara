import express from "express";
import * as memberController from "../controller/membership.controller.js";
import * as validateMember from "../validation/membership.validation.js";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

const Router = express.Router();

Router.post(
  "/create/:waveId",
  auth,
  validate(validateMember.setMemberSchema),
  memberController.setMembership,
);
Router.post(
  "/banned/:waveId/:memberId",
  auth,
  validate(validateMember.banMemberSchema),
  memberController.banMembership,
);
Router.post(
  "/remove/:waveId/:memberId",
  auth,
  validate(validateMember.removeMemberSchema),
  memberController.removeMembership,
);
Router.post(
  "/leave/:waveId",
  auth,
  validate(validateMember.leaveMemberSchema),
  memberController.leaveMembership,
);
Router.post(
  "/:waveId/transfer-admin/:memberId",
  auth,
  validate(validateMember.transferAdminSchema),
  memberController.transferAdmin,
);
Router.post(
  "/:waveId/members/:memberId/role",
  auth,
  validate(validateMember.updateModeratorSchema),
  memberController.updateModeratorRole,
);

export default Router;
