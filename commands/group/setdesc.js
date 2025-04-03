const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setdesc",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "by itsreimau"))
        );

        try {
            await ctx.group().updateDescription(input);

            return await ctx.reply(quote(`✅ Berhasil mengubah deskripsi grup!`));
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};