const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

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
            const senderNumber = senderJid.split("@")[0];
            const [number, ...text] = ctx._args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === senderNumber) return ctx.reply(quote(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`));

            const menfessText =
                `${text.join(" ")}\n` +
                `${global.msg.readmore}\n` +
                "Jika Anda ingin membalas, cukup balas pesan ini dan pesan Anda akan terkirim.";
            const fakeText = {
                key: {
                    fromMe: false,
                    participant: `${numberFormatted}@s.whatsapp.net`, // Change it to "0@s.whatsapp.net" if you want to become an official WhatsApp account.
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
            await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                text: menfessText,
                contextInfo: {
                    mentionedJid: [`${numberFormatted}@s.whatsapp.net`],
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
                mentions: [`${numberFormatted}@s.whatsapp.net`]
            }, {
                quoted: fakeText
            });
            global.db.set(`menfess.${numberFormatted}`, {
                from: senderNumber,
                text: menfessText
            });

            return ctx.reply(quote(`${bold("[ ! ]")} Pesan berhasil terkirim!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};