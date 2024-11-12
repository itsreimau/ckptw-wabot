const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "bcgc",
    aliases: ["broadcastgc"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "halo dunia!"))
        );

        try {
            const delay = ms => new Promise(res => setTimeout(res, ms));
            const groupData = await ctx._client.groupFetchAllParticipating();
            const groupIds = Object.values(groupData).map(group => group.id);

            const waitMsg = await ctx.reply(quote(`🔄 Mengirim siaran ke ${groupIds.length} grup, perkiraan waktu: ${(groupIds.length * 0.5)} detik.`));

            const failedGroupIds = [];

            for (const groupId of groupIds) {
                await delay(500);
                try {
                    await ctx.sendMessage(groupId, {
                        text: broadcastMessage,
                        contextInfo: {
                            externalAdReply: {
                                mediaType: 1,
                                previewType: 0,
                                mediaUrl: config.bot.website,
                                title: "BROADCAST",
                                renderLargerThumbnail: true,
                                thumbnailUrl: config.bot.thumbnail,
                                sourceUrl: config.bot.website
                            },
                            forwardingScore: 9999,
                            isForwarded: true
                        }
                    });
                } catch (error) {
                    console.error(`[${config.pkg.name}] Error:`, error);
                    failedGroupIds.push(groupId);
                }
            }

            const successCount = groupIds.length - failedGroupIds.length;
            return await ctx.editMessage(waitMsg.key, quote(`✅ Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup.`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};