const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "prompttoprompt",
    aliases: ["prompt2prompt"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/tools/prompt-to-prompt", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result.generated;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};