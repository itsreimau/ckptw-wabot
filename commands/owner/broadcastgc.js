const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "broadcastgc",
    aliases: ["bcgc"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "halo, dunia!"))}\n` +
            quote(tools.cmd.generateNotes(["Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah."]))
        );

        try {
            const delay = ms => new Promise(res => setTimeout(res, ms));
            const groupData = await ctx.core.groupFetchAllParticipating();
            const groupIds = Object.values(groupData).map(g => g.id);

            const waitMsg = await ctx.reply(quote(`🔄 Mengirim siaran ke ${groupIds.length} grup, perkiraan waktu: ${(groupIds.length * 0.5 / 60).toFixed(2)} menit.`));

            const failedGroupIds = [];

            for (const groupId of groupIds) {
                await delay(500);
                try {
                    const fakeQuotedText = {
                        key: {
                            participant: "13135550002@s.whatsapp.net",
                            remoteJid: "status@broadcast"
                        },
                        message: {
                            extendedTextMessage: {
                                text: config.msg.note,
                                title: config.bot.name
                            }
                        }
                    };
                    await ctx.sendMessage(groupId, {
                        image: {
                            url: config.bot.thumbnail
                        },
                        mimetype: mime.lookup("png"),
                        caption: input,
                        contextInfo: {
                            forwardingScore: 9999,
                            isForwarded: true
                        },
                    }, {
                        quoted: fakeQuotedText
                    });
                } catch (error) {
                    failedGroupIds.push(groupId);
                }
            }

            const successCount = groupIds.length - failedGroupIds.length;
            return await ctx.editMessage(waitMsg.key, quote(`✅ Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};