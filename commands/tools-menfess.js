const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "menfess",
    aliases: ["conf", "confes", "confess", "menf", "menfes"],
    category: "global.tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            energy: 10,
            cooldown: true,
            private: true
        });
        if (status) return ctx.reply(message);

        if (!ctx.args.length) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "halo dunia!"))
        );

        try {
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");
            const [number, ...text] = ctx.args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === senderNumber) return ctx.reply(quote(`⚠ Tidak dapat digunakan pada diri Anda sendiri.`));

            const menfessText =
                `${text.join(" ")}\n` +
                `${global.msg.readmore}\n` +
                "Jika Anda ingin membalas, cukup balas pesan ini dan pesan Anda akan terkirim.";
            const fakeText = {
                key: {
                    fromMe: false,
                    participant: numberFormatted + S_WHATSAPP_NET,
                    ...({
                        remoteJid: "status@broadcast"
                    })
                },
                message: {
                    extendedTextMessage: {
                        text: "Seseorang telah mengirimimu pesan menfess.",
                        title: global.bot.name,
                        thumbnailUrl: global.bot.thumbnail

                    }
                }
            }
            await ctx.sendMessage(numberFormatted + S_WHATSAPP_NET, {
                text: menfessText,
                contextInfo: {
                    mentionedJid: [numberFormatted + S_WHATSAPP_NET],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: global.bot.groupChat,
                        title: global.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: global.bot.thumbnail,
                        sourceUrl: global.bot.groupChat
                    },
                    forwardingScore: 9999,
                    isForwarded: true
                },
                mentions: [numberFormatted + S_WHATSAPP_NET]
            }, {
                quoted: fakeText
            });
            global.db.set(`menfess.${numberFormatted}`, {
                from: senderNumber,
                text: menfessText
            });

            return ctx.reply(quote(`✅ Pesan berhasil terkirim!`));
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};