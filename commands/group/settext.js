const {
    monospace,
    quote
} = require("@im-dims/baileys-library");

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
        const key = ctx.args[0];
        const text = ctx.args.slice(1).join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;

        if (!key && !text) return await ctx.reply(
            `${quote(`${tools.cmd.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "welcome Selamat datang di grup!"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (key === "list") {
            const listText = await tools.list.get("settext");
            return await ctx.reply(listText);
        }

        try {
            const groupId = tools.general.getID(ctx.id);
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                case "intro":
                case "welcome":
                    setKey = `group.${groupId}.text.${key.toLowerCase()}`;
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