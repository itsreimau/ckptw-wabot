const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "settext",
    aliases: ["settxt"],
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const [key, text] = await Promise.all([
            ctx.args[0],
            ctx.args.slice(1).join(" ")
        ]);

        if (!key && !text) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "welcome Selamat datang di grup!"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("settext");
            return await ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx.id.split("@")[0] : null;
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                    setKey = `group.${groupNumber}.text.goodbye`;
                    break;
                case "intro":
                    setKey = `group.${groupNumber}.text.intro`;
                    break;
                    intro
                case "welcome":
                    setKey = `group.${groupNumber}.text.welcome`;
                    break;
                default:
                    return await ctx.reply(quote(`❎ Key '${key}' tidak valid!`));
            }

            await db.set(setKey, text);
            return await ctx.reply(quote(`✅ Pesan untuk key '${key}' berhasil disimpan!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};