module.exports = {
    name: "settext",
    aliases: ["settxt"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const key = ctx.args[0] || null;
        const text = ctx.args.slice(1).join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!key || !text) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "welcome Selamat datang di grup!"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru.", `Gunakan ${formatter.monospace("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`]))
        );

        if (["l", "list"].includes(key.toLowerCase())) {
            const listText = await tools.list.get("settext");
            return await ctx.reply(listText);
        }

        try {
            const groupId = ctx.getId(ctx.id);
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                case "intro":
                case "welcome":
                    setKey = `group.${groupId}.text.${key.toLowerCase()}`;
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