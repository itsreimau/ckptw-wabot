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
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "halo dunia!"))
        );

        try {
            const delay = (time) => new Promise((res) => setTimeout(res, time));
            const getGroups = await ctx._client.groupFetchAllParticipating();
            const groups = Object.entries(getGroups).map((entry) => entry[1]);
            const anu = groups.map((a) => a.id);

            await ctx.reply(quote(`🔄 Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${(anu.length * 0.5)} detik.`));

            const failedGroups = [];

            for (let i of anu) {
                await delay(500);

                try {
                    await ctx.sendMessage(i, {
                        text: input,
                        contextInfo: {
                            externalAdReply: {
                                mediaType: 1,
                                previewType: 0,
                                mediaUrl: config.bot.groupChat,
                                title: "BROADCAST",
                                body: null,
                                renderLargerThumbnail: true,
                                thumbnailUrl: config.bot.picture.thumbnail,
                                sourceUrl: config.bot.groupChat
                            },
                            forwardingScore: 9999,
                            isForwarded: true
                        }
                    });
                } catch (error) {
                    console.error(`[${config.pkg.name}] Error:`, error);
                    failedGroups.push(i);
                }
            }

            if (failedGroups.length > 0) {
                await ctx.reply(quote(`⚠️ Tidak dapat mengirimkan siaran ke ${failedGroups.length} grup. Akan mencoba ulang dalam beberapa detik...`));

                for (let i of failedGroups) {
                    await delay(1000);

                    try {
                        await ctx.sendMessage(i, {
                            text: input,
                            contextInfo: {
                                externalAdReply: {
                                    mediaType: 1,
                                    previewType: 0,
                                    mediaUrl: config.bot.groupChat,
                                    title: "BROADCAST - Ulang",
                                    body: null,
                                    renderLargerThumbnail: true,
                                    thumbnailUrl: config.bot.picture.thumbnail,
                                    sourceUrl: config.bot.groupChat
                                },
                                forwardingScore: 9999,
                                isForwarded: true
                            }
                        });
                    } catch (retryError) {
                        console.error(`[${config.pkg.name}] Error:`, error);
                    }
                }
            }

            return await ctx.reply(quote(`✅ Berhasil mengirimkan siaran ke ${anu.length - failedGroups.length} obrolan grup. ${failedGroups.length > 0 ? `Beberapa grup gagal dikirimi: ${failedGroups.length} grup.` : ''}`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};