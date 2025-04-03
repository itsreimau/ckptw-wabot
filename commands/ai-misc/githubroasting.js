const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "githubroasting",
    aliases: ["ghroast", "ghroasting", "githubroast"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "itsreimau"))
        );

        try {
            const apiUrl = tools.api.createUrl("fast", "/aiexperience/github/roasting", {
                username: input,
                profile: false,
                language: ctx.sender.jid.startsWith("62") ? "id" : "en"
            });
            const result = (await axios.get(apiUrl)).data.result.roasting;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};