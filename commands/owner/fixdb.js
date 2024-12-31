const {
    monospace,
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
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args[0] || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "user"))
        );

        if (input === "list") {
            const listText = await tools.list.get("fixdb");
            return await ctx.reply(listText);
        }

        try {
            const waitMsg = await ctx.reply(config.msg.wait);

            const dbJSON = await db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;

            switch (input) {
                case "user": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data pengguna...`));
                    Object.keys(user).forEach(async (userId) => {
                        const userData = user[userId] || {};
                        const {
                            afk,
                            banned,
                            coin = 1000,
                            lastClaim,
                            level = 0,
                            premium,
                            uid,
                            winGame,
                            xp = 0
                        } = userData;

                        const filteredData = {
                            ...(afk && {
                                afk
                            }),
                            banned,
                            coin,
                            lastClaim,
                            level,
                            ...(premium && {
                                premium
                            }),
                            ...(uid && {
                                uid
                            }),
                            ...(winGame && {
                                winGame
                            }),
                            xp
                        };

                        if (!/^[0-9]$/.test(userId)) {
                            await db.delete(`user.${userId}`);
                        } else {
                            await db.set(`user.${userId}`, filteredData);
                        }
                    });
                    break;
                }

                case "group": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data grup...`));
                    Object.keys(group).forEach(async (groupId) => {
                        const groupData = group[groupId] || {};
                        const {
                            text,
                            option
                        } = groupData;

                        const filteredGroupData = {
                            ...(text && {
                                text
                            }),
                            ...(option && {
                                option
                            })
                        };

                        if (!/^[0-9]$/.test(groupId)) {
                            await db.delete(`group.${groupId}`);
                        } else {
                            await db.set(`group.${groupId}`, filteredGroupData);
                        }
                    });
                    break;
                }

                case "menfess": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data menfess...`));
                    Object.keys(menfess).forEach(async (conversationId) => {
                        const {
                            from,
                            to
                        } = menfess[conversationId] || {};

                        const filteredMenfessData = {
                            ...(from && {
                                from
                            }),
                            ...(to && {
                                to
                            })
                        };

                        if (!/^[0-9]$/.test(conversationId)) {
                            await db.delete(`menfess.${conversationId}`);
                        } else {
                            await db.set(`menfess.${conversationId}`, filteredMenfessData);
                        }
                    });
                    break;
                }

                default: {
                    return await ctx.reply(quote(`❎ Key '${input}' tidak valid!`));
                }
            }

            return await ctx.editMessage(waitMsg.key, quote(`✅ Basis data berhasil dibersihkan untuk ${input}!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};