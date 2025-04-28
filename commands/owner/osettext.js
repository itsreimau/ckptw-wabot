const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0];
        const text = ctx.args.slice(1).join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean)

        if (!key && !text) return await ctx.reply(
            `${quote(`${tools.cmd.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "price $1 untuk sewa bot 1 bulan"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah."]))
        );

        if (key === "list") {
            const listText = await tools.list.get("osettext");
            return await ctx.reply(listText);
        }

        try {
            let setKey;

            switch (key.toLowerCase()) {
                case "price":
                    setKey = "bot.text.price";
                    break;
                case "donate":
                    setKey = "bot.text.donate";
                    break;
                default:
                    return await ctx.reply(quote(`❎ Key '${key}' tidak valid!`));
            }

            await db.set(setKey, text);
            return await ctx.reply(quote(`✅ Pesan untuk key '${key}' berhasil disimpan!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};