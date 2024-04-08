exports.isOwner = (ctx) => {
    const isOwner = ctx._sender.jid.includes(global.owner.number);
    return isOwner;
}

exports.isNotOwner = (ctx) => {
    const isOwner = ctx._sender.jid.includes(global.owner.number);
    return !isOwner;
}

exports.isAdmin = async (ctx) => {
    const isAdmin = await checkAdmin(ctx, ctx._sender.jid.split('@')[0]);
    return isAdmin;
}

exports.isNotAdmin = async (ctx) => {
    const isAdmin = await checkAdmin(ctx, ctx._sender.jid.split('@')[0]);
    return !isAdmin;
}

exports.isAdminOf = async (ctx) => {
    const isAdminOfGroup = await checkAdmin(ctx, ctx._client.user.id.split(':')[0]);
    return isAdminOfGroup;
}

exports.isNotAdminOf = async (ctx) => {
    const isAdminOfGroup = await checkAdmin(ctx, ctx._client.user.id.split(':')[0]);
    return !isAdminOfGroup;
}

exports.isGroup = (ctx) => {
    return ctx.isGroup();
}

exports.isPrivate = (ctx) => {
    return !ctx.isGroup();
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
