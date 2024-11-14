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

        try {
            const [number, ...text] = ctx.args;
            const numberFormatted = number.replace(/[^\d]/g, "");

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
            const menfessText = text.join(" ");
            await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                text: menfessText
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