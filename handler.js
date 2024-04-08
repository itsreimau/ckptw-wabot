exports.isAdmin = async (ctx, negation = false) => {
    const isAdmin = await checkAdmin(ctx, ctx._sender.jid.split('@')[0]);
    return negation ? !isAdmin : isAdmin;
}

exports.isAdminOf = async (ctx, negation = false) => {
    const isAdminOfGroup = await checkAdmin(ctx, ctx._client.user.id.split(':')[0]);
    return negation ? !isAdminOfGroup : isAdminOfGroup;
}

exports.isOwner = (ctx, negation = false) => {
    const isOwner = ctx._sender.jid.includes(global.owner.number);
    return negation ? !isOwner : isOwner;
}

async function checkAdmin(ctx, id) {
    const groupMetadata = await ctx._client.groupMetadata(ctx.id);

    if (groupMetadata) {
        const participants = groupMetadata.participants;
        const participant = participants.find(participant => participant.id.split('@')[0] === id);
        return participant && participant.admin === 'admin';
    } else {
        return false;
    }
}