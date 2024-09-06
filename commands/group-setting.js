const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "group",
    category: "group",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`⚠ ${await global.tools.msg.translate(`${await global.tools.msg.argument} Argumen yang tersedia adalah open, close, lock, dan unlock.`, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} open`)}`)
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
                    return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Argumen yang tersedia adalah open, close, lock, dan unlock.", userLanguage)}`));
            }

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate("Berhasil mengubah setelan grup!", userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};