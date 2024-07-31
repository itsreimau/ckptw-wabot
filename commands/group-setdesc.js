const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setdesc",
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
            `${global.msg.argument}\n` +
            `Example: ${monospace(`${ctx._used.prefix + ctx._used.command} fuck you!`)}`
        );

        try {
            await ctx.group().updateDescription(input);

            return ctx.reply(`${bold("[ ! ]")} Berhasil mengubah deskripsi grup!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};