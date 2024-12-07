const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "group",
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "open"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("group");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "open":
                    await ctx.group().open();
                    break;
                case "close":
                    await ctx.group().close();
                    break;
                case "lock":
                    await ctx.group().lock();
                    break;
                case "unlock":
                    await ctx.group().unlock();
                    break;
                default:
                    return await ctx.reply(quote(`❎ Teks tidak valid!`));
            }

            return await ctx.reply(quote(`✅ Berhasil mengubah setelan grup!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};