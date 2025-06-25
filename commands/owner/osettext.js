module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0] || null;
        const text = ctx.args.slice(1).join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean)

        if (!key || !text) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "price $1 untuk sewa bot 1 bulan"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah.", `Gunakan ${formatter.monospace("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`]))
        );

        if (["l", "list"].includes(key.toLowerCase())) {
            const listText = await tools.list.get("osettext");
            return await ctx.reply(listText);
        }

        try {
            let setKey;

            switch (key.toLowerCase()) {
                case "donate":
                case "price":
                    setKey = `bot.text.${key.toLowerCase()}`;
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Teks '${key}' tidak valid!`));
            }

            if (["d", "delete"].includes(text.toLowerCase())) {
                await db.delete(setKey);
                return await ctx.reply(formatter.quote(`🗑️ Pesan untuk teks '${key}' berhasil dihapus!`));
            }

            await db.set(setKey, text);
            return await ctx.reply(formatter.quote(`✅ Pesan untuk teks '${key}' berhasil disimpan!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};