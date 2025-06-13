const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "namapurba",
    aliases: ["purba"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))
        );

        try {
            const result = input.replace(/[aiueo]/gi, "$&ve");

            return await ctx.reply(quote(result));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};