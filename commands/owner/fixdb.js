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
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        try {
            const waitMsg = await ctx.reply(config.msg.wait);

            const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const dbJSON = await db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;

            const userImportantKeys = ["afk", "coin", "isBanned", "isPremium", "lastClaim", "lastUse", "level", "winGame", "xp"];
            const groupImportantKeys = ["antilink", "welcome"];

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data pengguna...`));
            Object.keys(user).forEach((userId) => {
                const {
                    lastUse,
                    ...userData
                } = user[userId] || {};

                if (!/^[0-9]{10,15}$/.test(userId) || (lastUse && new Date(lastUse).getTime() < oneMonthAgo)) {
                    db.delete(`user.${userId}`);
                } else {
                    const filteredData = Object.fromEntries(Object.entries(userData).filter(([key]) => userImportantKeys.includes(key)));
                    db.set(`user.${userId}`, {
                        ...filteredData,
                        lastUse
                    });
                }
            });

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data grup...`));
            Object.keys(group).forEach((groupId) => {
                const groupData = group[groupId] || {};

                if (!/^[0-9]{10,15}$/.test(groupId)) {
                    db.delete(`group.${groupId}`);
                } else {
                    const filteredGroupData = Object.fromEntries(Object.entries(groupData).filter(([key]) => groupImportantKeys.includes(key)));
                    db.set(`group.${groupId}`, filteredGroupData);
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
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};