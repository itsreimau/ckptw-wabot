const {
    bold,
    monospace
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
            `${global.msg.argument} Argumen yang tersedia adalah open, close, lock, dan unlock.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} open`)}`
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
                    return ctx.reply(
                        `${bold("[ ! ]")} Argumen yang tersedia adalah open, close, lock, dan unlock.`
                    );
            }

            return ctx.reply(`${bold("[ ! ]")} Berhasil mengubah setelan grup!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};