const {
    quote
} = require("@itsreimau/ckptw-mod");

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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "by itsreimau"))
        );

        try {
            await ctx.group().updateDescription(input);

            return await ctx.reply(quote("✅ Berhasil mengubah deskripsi grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};