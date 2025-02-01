const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "menfess",
    aliases: ["conf", "confes", "confess", "menf", "menfes"],
    category: "tool",
    permissions: {
        coin: 10,
        private: true
    },
    code: async (ctx) => {
        const [id, ...text] = ctx.args;
        const formattedId = id ? id.replace(/[^\d]/g, "") : null;
        const menfessText = text ? text.join(" ") : null;

        const senderId = tools.general.getID(ctx.sender.jid);

        if (!formattedId && !menfessText) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, `${senderId} halo, dunia!`))}\n` +
            quote(tools.msg.generateNotes(["Jangan gunakan spasi pada angka. Contoh: +62 8123-4567-8910, seharusnya +628123-4567-8910"]))
        );

        const allMenfessDb = await db.get("menfess") || {};
        const isSenderInMenfess = Object.values(allMenfessDb).some(m => m.from === senderId || m.to === senderId);
        const isReceiverInMenfess = Object.values(allMenfessDb).some(m => m.from === formattedId || m.to === formattedId);

        if (isSenderInMenfess) return await ctx.reply(quote(`❎ Anda tidak dapat mengirim menfess karena Anda sudah terlibat dalam percakapan lain.`));
        if (isReceiverInMenfess) return await ctx.reply(quote(`❎ Anda tidak dapat mengirim menfess kepada pengguna ini karena dia sedang terlibat dalam percakapan lain.`));

        try {
            if (formattedId === senderId) return await ctx.reply(quote(`❎ Tidak dapat digunakan pada diri Anda sendiri.`));

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

            await ctx.sendMessage(`${formattedId}@s.whatsapp.net`, {
                text: `${menfessText}\n` +
                    `${config.msg.readmore}\n` +
                    quote("Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik 'delete' atau 'stop'.")
            }, {
                quoted: fakeText
            });

            await db.set(`menfess.${Date.now()}`, {
                from: senderId,
                to: formattedId
            });

            return await ctx.reply(quote(`✅ Pesan berhasil terkirim! Pesan yang Anda kirim akan diteruskan ke orang tersebut. Jika ingin berhenti, cukup ketik 'delete' atau 'stop'.`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};