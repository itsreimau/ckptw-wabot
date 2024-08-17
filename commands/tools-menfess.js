const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "menfess",
    aliases: ["conf", "menf", "confes", "menfes", "confess"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3,
            private: true
        });
        if (status) return ctx.reply(message);

        if (!ctx._args.length) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]} halo!`)}`)
        );

        try {
            const senderJid = ctx._sender.jid;
            const senderNumber = ctx._sender.jid.replace(/@.*|:.*/g, '');
            const [number, ...text] = ctx._args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === senderNumber) return ctx.reply(quote(`⚠ Tidak dapat digunakan pada diri Anda sendiri.`));

            const menfessText =
                `${text.join(" ")}\n` +
                `${global.msg.readmore}\n` +
                "Jika Anda ingin membalas, cukup balas pesan ini dan pesan Anda akan terkirim.";
            const fakeText = {
                key: {
                    fromMe: false,
                    participant: numberFormatted + S_WHATSAPP_NET, // Change it to "0S_WHATSAPP_NET" if you want to become an official WhatsApp account.
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

            return ctx.reply(quote(`⚠ Pesan berhasil terkirim!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};