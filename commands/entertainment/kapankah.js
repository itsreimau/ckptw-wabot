const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "kapankah",
    aliases: ["kapan"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion itu peak?"))
        );

        try {
            const minMs = 1000;
            const maxMs = 1000 * 60 * 60 * 24 * 365.25 * 10;
            const randomMs = Math.floor(Math.random() * (maxMs - minMs) + minMs);
            const duration = tools.general.convertMsToDuration(randomMs);

            return await ctx.reply(quote(`${duration} lagi...`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};