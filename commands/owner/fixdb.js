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
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "user -d 30"))}\n` +
            `${quote(tools.msg.generatesFlagInformation({
                "-d": "Tentukan hari untuk menghapus data 'last...' pada hari itu."
            }))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (input === "list") {
            const listText = await tools.list.get("fixdb");
            return await ctx.reply(listText);
        }

        const flag = tools.general.parseFlag(ctx.args.slice(1).join(" "), {
            "-d": {
                type: "number",
                key: "days"
            }
        });

        const days = flag.days || 30;
        const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);

        try {
            const waitMsg = await ctx.reply(config.msg.wait);

            const dbJSON = await db.toJSON();
            const {
                user = {}, group = {}, menfess = {}
            } = dbJSON;

            switch (input) {
                case "user": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data pengguna...`));
                    const importantKeys = ["afk", "autolevelup", "coin", "banned", "premium", "lastClaim", "lastUse", "level", "uid", "winGame", "xp"];

                    Object.keys(user).forEach((userId) => {
                        const {
                            lastUse,
                            ...userData
                        } = user[userId] || {};
                        if (!/^[0-9]{10,15}$/.test(userId) || (lastUse && new Date(lastUse).getTime() < cutoffTime)) {
                            db.delete(`user.${userId}`);
                        } else {
                            const filteredData = Object.fromEntries(Object.entries(userData).filter(([key]) => importantKeys.includes(key)));
                            db.set(`user.${userId}`, {
                                ...filteredData,
                                lastUse
                            });
                        }
                    });
                    break;
                }

                case "group": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data grup...`));
                    const importantKeysGroup = ["lastUse", "option", "text"];

                    const groupData = await ctx._client.groupFetchAllParticipating();
                    const groupIds = Object.values(groupData).map(g => g.id.split("@")[0]);

                    Object.keys(group).forEach((groupId) => {
                        const groupData = group[groupId] || {};
                        const {
                            lastUse,
                            option,
                            text
                        } = groupData;

                        if (!/^[0-9]{10,15}$/.test(groupId) || !groupIds.includes(groupId)) {
                            db.delete(`group.${groupId}`);
                        } else {
                            const filteredGroupData = {
                                lastUse,
                                option,
                                text
                            };
                            db.set(`group.${groupId}`, filteredGroupData);
                        }
                    });
                    break;
                }

                case "menfess": {
                    await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data menfess...`));
                    const importantKeysMenfess = ["from", "lastMsg", "to"];

                    Object.keys(menfess).forEach((conversationId) => {
                        const {
                            from,
                            lastMsg,
                            to
                        } = menfess[conversationId] || {};

                        if (!/^[0-9]{10,15}$/.test(conversationId)) {
                            db.delete(`menfess.${conversationId}`);
                        } else {
                            const filteredMenfessData = Object.fromEntries(Object.entries({
                                from,
                                lastMsg,
                                to
                            }).filter(([key]) => importantKeysMenfess.includes(key)));
                            db.set(`menfess.${conversationId}`, filteredMenfessData);
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