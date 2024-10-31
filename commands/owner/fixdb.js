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
            const waitMsg = await ctx.reply(config.msg.wait);

            const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const dbJSON = await db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;
            const importantKeys = ["coin", "level", "isPremium", "lastClaim", "winGame", "isBanned", "lastUse", "xp", "afk"];

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data pengguna...`));
            Object.keys(user).forEach((userId) => {
                const {
                    lastUse,
                    ...userData
                } = user[userId] || {};

                if (!/^[0-9]{10,15}$/.test(userId) || (lastUse && new Date(lastUse).getTime() < oneMonthAgo)) {
                    db.delete(`user.${userId}`);
                } else {
                    const filteredData = Object.fromEntries(Object.entries(userData).filter(([key]) => importantKeys.includes(key)));
                    db.set(`user.${userId}`, {
                        ...filteredData,
                        lastUse
                    });
                }
            });

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data grup...`));
            Object.keys(group).forEach((groupId) => {
                if (!/^[0-9]{10,15}$/.test(groupId)) {
                    db.delete(`group.${groupId}`);
                }
            });

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data menfess...`));
            Object.keys(menfess).forEach((conversationId) => {
                const {
                    lastMsg
                } = menfess[conversationId] || {};
                if (lastMsg && new Date(lastMsg).getTime() < oneMonthAgo) {
                    db.delete(`menfess.${conversationId}`);
                }
            });

            return await ctx.editMessage(waitMsg.key, quote(`✅ Basis data berhasil diperbaiki!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};