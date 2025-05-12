const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "setname",
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
            quote(tools.cmd.generateCommandExample(ctx.used, "ckptw-wabot"))
        );

        try {
            await ctx.group().updateSubject(input);

            return await ctx.reply(quote("✅ Berhasil mengubah nama grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};