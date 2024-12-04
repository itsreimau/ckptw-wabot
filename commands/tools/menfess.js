const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "menfess",
    aliases: ["conf", "confes", "confess", "menf", "menfes"],
    category: "tools",
    handler: {
        coin: [10, "text", 1],
        private: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const [number, ...text] = ctx.args;
        const numberFormatted = number ? number.replace(/[^\d]/g, "") : null;
        const menfessText = text ? text.join(" ") : null;

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split(/[:@]/)[0];

        if (!numberFormatted && !menfessText) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `${senderNumber} halo dunia!`))}\n` +
            quote(tools.msg.generateNotes(["Jangan gunakan spasi pada angka. Contoh: +62 8123-4567-8910, seharusnya +628123-4567-8910"]))
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
            if (numberFormatted === senderNumber) return await ctx.reply(quote(`❎ Tidak dapat digunakan pada diri Anda sendiri.`));

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
                    quote("Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik 'delete' atau 'stop'.")
            }, {
                quoted: fakeText
            });

            db.set(`menfess.${Date.now()}`, {
                from: senderNumber,
                to: numberFormatted,
                lastMsg: Date.now()
            });

            return await ctx.reply(quote(`✅ Pesan berhasil terkirim! Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik 'delete' atau 'stop'.`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};