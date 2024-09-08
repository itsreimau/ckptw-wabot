const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setdesc",
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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} fuck you!`)}`)
        );

        try {
            await ctx.group().updateDescription(input);

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate("Berhasil mengubah deskripsi grup!", userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};