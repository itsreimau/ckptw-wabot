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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "gaxtawu"))
        );

        try {
            await ctx.group().updateSubject(input);

            return await ctx.reply(formatter.quote("✅ Berhasil mengubah nama grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};