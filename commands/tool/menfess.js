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
        const targetId = id ? id.replace(/[^\d]/g, "") : null;
        const menfessText = text ? text.join(" ") : null;

        const senderId = ctx.getId(ctx.sender.jid);

        if (!targetId && !menfessText) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `${senderId} halo, dunia!`))}\n` +
            formatter.quote(tools.msg.generateNotes(["Jangan gunakan spasi pada angka. Contoh: +62 8123-4567-8910, seharusnya +628123-4567-8910"]))
        );

        const allMenfessDb = await db.get("menfess") || {};
        const isSenderInMenfess = Object.values(allMenfessDb).some(m => m.from === senderId || m.to === senderId);
        const isReceiverInMenfess = Object.values(allMenfessDb).some(m => m.from === targetId || m.to === targetId);

        if (isSenderInMenfess) return await ctx.reply(formatter.quote("❎ Kamu tidak dapat mengirim menfess karena sedang terlibat dalam percakapan lain."));
        if (isReceiverInMenfess) return await ctx.reply(formatter.quote("❎ Kamu tidak dapat mengirim menfess, karena dia sedang terlibat dalam percakapan lain."));
        if (targetId === senderId) return await ctx.reply(formatter.quote("❎ Tidak dapat digunakan pada diri sendiri."));

        try {
            const buttons = [{
                buttonId: "delete",
                buttonText: {
                    displayText: "Hapus Menfess"
                },
                type: 1
            }];

            await ctx.sendMessage(`${targetId}@s.whatsapp.net`, {
                text: menfessText,
                footer: formatter.quote(`Setiap pesan yang kamu kirim akan diteruskan ke orang tersebut.`),
                buttons,
                headerType: 1
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText("Seseorang telah mengirimi-mu menfess.")
            });
            await db.set(`menfess.${Date.now()}`, {
                from: senderId,
                to: targetId
            });

            return await ctx.reply({
                text: formatter.quote(`✅ Pesan berhasil terkirim!`),
                footer: config.msg.footer,
                buttons,
                headerType: 1
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};