const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "namapurba",
    aliases: ["purba"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "itsreimau"))
        );

        try {
            const result = input.replace(/[aiueo]/gi, "$&ve");

            return await ctx.reply(quote(result));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};