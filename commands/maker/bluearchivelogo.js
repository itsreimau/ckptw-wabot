const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "bluearchivelogo",
    aliases: ["balogo"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evang|elion"))
        );

        try {
            const [left, right] = input.split("|");
            const result = tools.api.createUrl("nekorinn", "/maker/ba-logo", {
                textL: left,
                textR: right
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};