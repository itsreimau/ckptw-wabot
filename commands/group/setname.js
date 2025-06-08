const {
    quote
} = require("@itsreimau/ckptw-mod");

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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "ckptw-wabot"))
        );

        try {
            await ctx.group().updateSubject(input);

            return await ctx.reply(quote("✅ Berhasil mengubah nama grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};