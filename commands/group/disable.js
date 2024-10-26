const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "disable",
    aliases: ["off"],
    category: "owner",
    handler: {
        admin: true,
        banned: true,
        botAdmin: true,
        cooldown: true,
        group: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "welcome"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("disable_enable");
            return await ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx.id.split("@")[0] : null;

            switch (input) {
                case "antilink":
                    await db.set(`group.${groupNumber}.antilink`, false);
                    return await ctx.reply(quote(`✅ Fitur 'antilink' berhasil dinonaktifkan!`));
                case "welcome":
                    await db.set(`group.${groupNumber}.welcome`, false);
                    return await ctx.reply(quote(`✅ Fitur 'welcome' berhasil dinonaktifkan!`));
                default:
                    return await ctx.reply(quote(`❎ Teks tidak valid.`));
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};