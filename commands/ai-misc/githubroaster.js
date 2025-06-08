const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "githubroaster",
    aliases: ["ghroast", "ghroaster", "githubroast"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "itsreimau"))
        );

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/ai-persona/githubroaster", {
                username: input
            });
            const result = (await axios.get(apiUrl)).data.message;

            return await ctx.reply(ctx.sender.jid.startsWith("62") ? await tools.cmd.translate(result, "id") : result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};