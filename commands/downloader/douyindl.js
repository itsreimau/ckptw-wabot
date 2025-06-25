const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "douyindl",
    aliases: ["douyin"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://v.douyin.com/d2OVRjYYi9s"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/download/douyin", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.media;

            return await ctx.reply({
                video: {
                    url: result.mp4_hd || result.mp4_2 || result.mp4_1
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