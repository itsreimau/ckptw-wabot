const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "simsimi",
    aliases: ["simi"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "halo, dunia!"))
        );

        try {
            const apiUrl = tools.api.createUrl("otinxsandip", "/sim", {
                chat: input,
                lang: ctx.sender.jid.startsWith("62") ? "id" : "en"
            });
            const result = (await axios.get(apiUrl)).data.answer;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};