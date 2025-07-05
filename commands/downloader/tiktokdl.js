const axios = require("axios");

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
            const apiUrl = tools.api.createUrl("vapis", "/api/ttdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.data;

            const video = result.find(r => r.type === "nowatermark");
            if (video) return await ctx.reply({
                video: {
                    url: video.url
                },
                mimetype: tools.mime.lookup("mp4"),
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer,
                interactiveButtons: []
            });

            const images = result.filter(r => r.type === "photo");
            for (const image of images) {
                await ctx.reply({
                    image: {
                        url: image.url
                    },
                    mimetype: tools.mime.lookup("jpeg"),
                    caption: formatter.quote(`URL: ${url}`),
                    footer: config.msg.footer,
                    interactiveButtons: []
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};