const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "menfess",
    aliases: ["conf", "confes", "confess", "menf", "menfes"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1],
        private: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split(/[:@]/)[0];

        if (!ctx.args.length) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `${senderNumber} halo dunia!`))
        );

        try {
            const [number, ...text] = ctx.args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === senderNumber) return await ctx.reply(quote(`❎ Tidak dapat digunakan pada diri Anda sendiri.`));

            const fakeText = {
                key: {
                    fromMe: false,
                    participant: numberFormatted + S_WHATSAPP_NET,
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: "Seseorang telah mengirimimu pesan menfess.",
                        title: config.bot.name,
                        thumbnailUrl: config.bot.picture.thumbnail
                    }
                }
            };
            const menfessText = text.join(" ");
            await ctx.sendMessage(numberFormatted + S_WHATSAPP_NET, {
                text: menfessText,
                contextInfo: {
                    mentionedJid: [numberFormatted + S_WHATSAPP_NET],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: config.bot.picture.thumbnail,
                        sourceUrl: config.bot.website
                    },
                    forwardingScore: 99999,
                    isForwarded: true
                },
                mentions: [numberFormatted + S_WHATSAPP_NET]
            }, {
                quoted: fakeText
            });

            const conversationId = `${senderNumber}_${numberFormatted}_${Date.now()}`;
            db.set(`menfess.${conversationId}`, {
                from: senderNumber,
                to: numberFormatted,
                lastMsg: Date.now()
            });

            return await ctx.reply(quote(`✅ Pesan berhasil terkirim!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};