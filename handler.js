exports.isAdmin = async (ctx, negation = false) => {
    const isAdmin = await getParticipantStatus(ctx, 'admin');
    return negation ? !isAdmin : isAdmin;
}

exports.isAdminOf = async (ctx, negation = false) => {
    const isAdminOfGroup = await getParticipantStatus(ctx, 'admin', true);
    return negation ? !isAdminOfGroup : isAdminOfGroup;
}

exports.isOwner = (ctx, negation = false) => {
    const isOwner = global.owner.number === ctx._sender.jid;
    return negation ? !isOwner : isOwner;
}

async function getParticipantStatus(ctx, role, botCheck = false) {
    const groupMetadata = await ctx._client.groupMetadata(ctx.id);

    if (groupMetadata) {
        const participants = groupMetadata.participants;
        const idToCheck = botCheck ? ctx._client.user.id.split(':')[0] : ctx._sender.jid.split('@')[0];
        const participant = participants.find(participant => participant.id.split('@')[0] === idToCheck);

        return participant && participant.admin === role;
    } else {
        return false;
    }
}