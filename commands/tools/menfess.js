const {
    quote
} = require("@mengkodingan/ckptw");

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
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split(/[:@]/)[0];

        if (!ctx.args.length) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `${senderNumber} halo dunia!`))
        );

        const allConversations = db.get("menfess") || {};
        const isInvolvedInConversation = Object.keys(allConversations).some(id => {
            const {
                from,
                to
            } = allConversations[id];
            return from === senderNumber || to === senderNumber;
        });
        if (isInvolvedInConversation) return await ctx.reply(quote(`❎ Anda sedang melakukan percakapan aktif. Selesaikan percakapan itu terlebih dahulu sebelum memulai percakapan baru.`));

        try {
            const [number, ...text] = ctx.args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === senderNumber) return await ctx.reply(quote(`❎ Tidak dapat digunakan pada diri Anda sendiri.`));

            const menfessText = text.join(" ");
            const fakeText = {
                key: {
                    fromMe: false,
                    participant: "13135550002@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: "Seseorang telah mengirimimu pesan menfess.",
                        title: config.bot.name,
                        thumbnailUrl: config.bot.thumbnail
                    }
                }
            };

            await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                text: `${menfessText}\n` +
                    `${config.msg.readmore}\n` +
                    quote("Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik "
                        delete " atau "
                        stop ".")
            }, {
                quoted: fakeText
            });

            const conversationId = `${senderNumber}_${numberFormatted}`;
            db.set(`menfess.${conversationId}`, {
                from: senderNumber,
                to: numberFormatted,
                lastMsg: Date.now()
            });

            return await ctx.reply(quote(`✅ Pesan berhasil terkirim! Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik "delete" atau "stop".`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};