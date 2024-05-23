const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "menfess",
    aliases: ["confess"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3,
            private: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]} Halo dunia!`)}`
        );

        try {
            const [number, ...text] = ctx._args;
            const numberFormatted = number.replace(/[^\d]/g, "");

            if (numberFormatted === ctx._sender.jid.split("@")[0]) throw new Error("Tidak dapat digunakan pada diri Anda sendiri.");

            await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                text: `❖ ${bold("Menfess")}\n` +
                    `Hai, saya ${global.bot.name}, seseorang mengirimi Anda pesan melalui menfess ini!\n` +
                    "\n" +
                    `${text.join(" ")}\n` +
                    "\n" +
                    global.msg.footer
            });

            global.db.set(`menfess.${numberFormatted}`, {
                from: ctx._sender.jid.split("@")[0],
                timeStamp: Date.now()
            });

            return ctx.reply("Pesan berhasil terkirim!");
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};