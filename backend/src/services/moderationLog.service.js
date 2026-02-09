import ModerationLog from "../models/moderationLog.model.js";

export const logModerationEvent = async ({
    session,
    waveId,
    actorId,
    targetId = null,
    action,
    reason = null,
    metadata = null
}) => {

    await ModerationLog.create([{
        waveId,
        actorId,
        targetId,
        action,
        reason,
        metadata
    }], { session });

};
