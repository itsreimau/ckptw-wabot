const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "fixdb",
    aliases: ["fixdatabase"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        try {
            const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const dbJSON = await db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;

            Object.keys(user).forEach((userId) => {
                const {
                    lastUse
                } = user[userId] || {};
                if (!/^[0-9]{10,15}$/.test(userId) || new Date(lastUse).getTime() < oneMonthAgo) {
                    db.delete(`user.${userId}`);
                }
            });

            Object.keys(group).forEach((groupId) => {
                if (!/^[0-9]{10,15}$/.test(groupId)) {
                    db.delete(`group.${groupId}`);
                }
            });

            Object.keys(menfess).forEach((conversationId) => {
                const {
                    lastMsg
                } = menfess[conversationId] || {};
                if (new Date(lastMsg).getTime() < oneMonthAgo) {
                    db.delete(`menfess.${conversationId}`);
                }
            });

            return await ctx.reply(quote(`✅ Basis data berhasil diperbaiki!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};