const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "chord",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "fly me to the moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("fasturl", "/music/chord", {
                song: input
            });
            const result = (await axios.get(apiUrl)).data.result.answer;

            return await ctx.reply(
                `${quote(`Judul: ${result.title}`)}\n` +
                `${quote("─────")}\n` +
                `${result.chord}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};