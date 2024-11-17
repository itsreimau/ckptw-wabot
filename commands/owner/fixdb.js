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
            const { user = {}, group = {}, menfess = {} } = dbJSON;

            const userImportantKeys = ["afk", "coin", "isBanned", "isPremium", "lastClaim", "lastUse", "level", "winGame", "xp"];
            const afkKeys = ["reason", "timeStamp"];
            const lastClaimKeys = ["daily", "weekly", "monthly", "yearly"];
            const groupImportantKeys = ["option", "text"];
            const optionKeys = ["antilinkgc", "antitoxic", "autokick", "welcome"];
            const textKeys = ["goodbye", "intro", "welcome"];

            const batchSize = 100; 
            const processBatch = async (data, processFunc) => {
                const keys = Object.keys(data);
                for (let i = 0; i < keys.length; i += batchSize) {
                    const batch = keys.slice(i, i + batchSize);
                    await Promise.all(batch.map(processFunc));
                }
            };

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data pengguna...`));
            await processBatch(user, async (userId) => {
                const { lastUse, afk = {}, lastClaim = {}, ...userData } = user[userId] || {};

                if (!/^[0-9]{10,15}$/.test(userId) || (lastUse && new Date(lastUse).getTime() < oneMonthAgo)) {
                    db.delete(`user.${userId}`);
                } else {
                    const filteredAfk = Object.fromEntries(Object.entries(afk).filter(([key]) => afkKeys.includes(key)));
                    const filteredLastClaim = Object.fromEntries(Object.entries(lastClaim).filter(([key]) => lastClaimKeys.includes(key)));
                    const filteredData = Object.fromEntries(Object.entries(userData).filter(([key]) => userImportantKeys.includes(key)));

                    db.set(`user.${userId}`, { ...filteredData, afk: filteredAfk, lastClaim: filteredLastClaim, lastUse });
                }
            });

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data grup...`));
            await processBatch(group, async (groupId) => {
                const { option = {}, text = {}, ...groupData } = group[groupId] || {};

                if (!/^[0-9]{10,15}$/.test(groupId)) {
                    db.delete(`group.${groupId}`);
                } else {
                    const filteredOption = Object.fromEntries(Object.entries(option).filter(([key]) => optionKeys.includes(key)));
                    const filteredText = Object.fromEntries(Object.entries(text).filter(([key]) => textKeys.includes(key)));
                    const filteredGroupData = Object.fromEntries(Object.entries(groupData).filter(([key]) => groupImportantKeys.includes(key)));

                    db.set(`group.${groupId}`, { ...filteredGroupData, option: filteredOption, text: filteredText });
                }
            });

            await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data menfess...`));
            await processBatch(menfess, async (conversationId) => {
                const { lastMsg, ...menfessData } = menfess[conversationId] || {};

                if (lastMsg && new Date(lastMsg).getTime() < oneMonthAgo) {
                    db.delete(`menfess.${conversationId}`);
                } else {
                    db.set(`menfess.${conversationId}`, {
                        from: menfessData.from,
                        to: menfessData.to,
                        lastMsg
                    });
                }
            });

            return await ctx.editMessage(waitMsg.key, quote(`✅ Basis data berhasil diperbaiki!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};
