const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "namaninja",
    aliases: ["ninja"],
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
            const result = input.replace(/[a-z]/gi, i => {
                return {
                    "a": "ka",
                    "b": "tu",
                    "c": "mi",
                    "d": "te",
                    "e": "ku",
                    "f": "lu",
                    "g": "ji",
                    "h": "ri",
                    "i": "ki",
                    "j": "zu",
                    "k": "me",
                    "l": "ta",
                    "m": "rin",
                    "n": "to",
                    "o": "mo",
                    "p": "no",
                    "q": "ke",
                    "r": "shi",
                    "s": "ari",
                    "t": "ci",
                    "u": "do",
                    "v": "ru",
                    "w": "mei",
                    "x": "na",
                    "y": "fu",
                    "z": "zi"
                } [i.toLowerCase()] || i
            });

            return await ctx.reply(quote(result));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};