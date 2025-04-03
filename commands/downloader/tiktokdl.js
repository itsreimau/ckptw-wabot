const {
    quote
} = require("@mengkodingan/ckptw");
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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/ -a -hd"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-a": "Kirim audio",
                "-hd": "Pilih resolusi HD"
            }))
        );

        const flag = tools.cmd.parseFlag(input, {
            "-a": {
                type: "boolean",
                key: "audio"
            },
            "-hd": {
                type: "boolean",
                key: "hd"
            }
        });

        const url = flag.input || null;

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const mediaType = flag.audio ? "audio" : "video_image";

            const apiUrl = tools.api.createUrl("agatz", "/api/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: result.music_info.url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (mediaType === "video_image") {
                const video = flag.hd ? result.data.find(video => video.type === "nowatermark_hd") : result.data.find(video => video.type === "nowatermark");

                return await ctx.reply({
                    video: {
                        url: video.url
                    },
                    mimetype: mime.lookup("mp4"),
                    caption: `${quote(`URL: ${url}`)}\n` +
                        "\n" +
                        config.msg.footer
                });
            }

            if (mediaType === "video_image") {
                const images = result.data.filter(item => item.type === "photo");

                if (images.length > 0) {
                    for (const image of images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png")
                        });
                    }
                }
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};