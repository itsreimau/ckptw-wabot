const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktoksearch",
    aliases: ["tiktoks", "ttsearch", "vts", "vtsearch"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/tiktoksearch", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data.no_watermark;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};