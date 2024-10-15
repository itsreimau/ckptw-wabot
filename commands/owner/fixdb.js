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
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        try {
            const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const dbJSON = await global.db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;

            Object.keys(user).forEach((userId) => {
                const {
                    lastUse
                } = user[userId] || {};
                if (!/^[0-9]{10,15}$/.test(userId) || new Date(lastUse).getTime() < oneMonthAgo) {
                    global.db.delete(`user.${userId}`);
                }
            });

            Object.keys(group).forEach((groupId) => {
                if (!/^[0-9]{10,15}$/.test(groupId)) {
                    global.db.delete(`group.${groupId}`);
                }
            });

            Object.keys(menfess).forEach((conversationId) => {
                const {
                    lastMsg
                } = menfess[conversationId] || {};
                if (new Date(lastMsg).getTime() < oneMonthAgo) {
                    global.db.delete(`menfess.${conversationId}`);
                }
            });

            return ctx.reply(quote(`✅ Basis data berhasil diperbaiki!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};