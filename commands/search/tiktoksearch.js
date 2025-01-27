const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktoksearch",
    aliases: ["ttsearch", "vts", "vtsearch"],
    category: "search",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("exodus", "/search/tiktok", {
                query: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply({
                video: {
                    url: data.no_watermark
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};