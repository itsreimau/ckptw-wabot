const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "komm susser tod"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/lirik", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply(
                `${quote(`Judul: ${result.title}`)}\n` +
                `${quote("─────")}\n` +
                `${result.lyrics}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};