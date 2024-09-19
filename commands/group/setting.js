const {
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
            cooldown: true,
            group: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`${global.tools.msg.generateInstruction(["send"], ["text"])} Argumen yang tersedia adalah open, close, lock, dan unlock.`)}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "open"))
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
                    return ctx.reply(quote(`❎ Argumen yang tersedia adalah open, close, lock, dan unlock.`));
            }

            return ctx.reply(quote(`✅ Berhasil mengubah setelan grup!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};