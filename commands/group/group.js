const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "group",
    category: "group",
    handler: {
        admin: true,
        banned: true,
        botAdmin: true,
        cooldown: true,
        group: true
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`${global.tools.msg.generateInstruction(["send"], ["text"])} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`)}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "open"))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("group");
            return ctx.reply(listText);
        }

        try {
            switch (input) {
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
                    return ctx.reply(quote(`❎ Teks tidak valid. Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`));
            }

            return ctx.reply(quote(`✅ Berhasil mengubah setelan grup!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};