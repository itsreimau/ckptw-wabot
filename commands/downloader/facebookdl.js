const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "facebookdl",
    aliases: ["facebook", "fb", "fbdl"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://web.facebook.com/hanabi.lemon/videos/455736192416206"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/downloader/facebook", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result[0];

            return await ctx.reply({
                video: {
                    url: result.url
                },
                mimetype: mime.lookup("mp4"),
                caption: `${formatter.quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};