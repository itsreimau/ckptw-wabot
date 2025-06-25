const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tiktoknowm", "tt", "ttdl", "vt", "vtdl", "vtdltiktok", "vtnowm"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@japanese_songs2/video/7472130814805822726"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/download/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.media;
            const video = result.play;
            const images = result?.image_slide;

            if (images) {
                for (const image of images) {
                    await ctx.reply({
                        image: {
                            url: image
                        },
                        mimetype: mime.lookup("jpeg")
                    });
                }
            } else if (video) {
                return await ctx.reply({
                    video: {
                        url: video
                    },
                    mimetype: mime.lookup("mp4"),
                    caption: `${formatter.quote(`URL: ${url}`)}\n` +
                        "\n" +
                        config.msg.footer
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};