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
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@japanese_songs2/video/7472130814805822726 -hd"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-hd": "Pilih resolusi HD"
            }))
        );

        const flag = tools.cmd.parseFlag(input, {
            "-hd": {
                type: "boolean",
                key: "hd"
            }
        });

        const url = flag.input || null;

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/ttdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.data;

            const videoType = flag?.hd ? "nowatermark_hd" : "nowatermark";
            const video = result.find(v => v.type === videoType);
            if (video) return await ctx.reply({
                video: {
                    url: video.url
                },
                mimetype: mime.lookup("mp4"),
                caption: `${formatter.quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });

            const images = result.filter(item => item.type === "photo");
            for (const image of images) {
                await ctx.reply({
                    image: {
                        url: image.url
                    },
                    mimetype: mime.lookup("jpeg")
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};