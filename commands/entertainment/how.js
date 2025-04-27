const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "how",
    aliases: ["segimana"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const types = ctx.args[0] || null;
        const input = ctx.args[1] || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "femboy itsreimau"))
        );

        try {
            const randomNumber = Math.floor(Math.random() * 100);

            return await ctx.reply(quote(`${input} itu ${randomNumber}% ${tools.genenral.ucword(types)}`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};