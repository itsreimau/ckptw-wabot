const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "group",
    category: "group",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true,
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`${global.msg.argument} Argumen yang tersedia adalah open, close, lock, dan unlock.`)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} open`)}`)
        );

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
                    return ctx.reply(quote(`⚠ Argumen yang tersedia adalah open, close, lock, dan unlock.`));
            }

            return ctx.reply(quote(`✅ Berhasil mengubah setelan grup!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};