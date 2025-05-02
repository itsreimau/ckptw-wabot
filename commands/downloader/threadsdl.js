const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "threadsdl",
    aliases: ["threads"],
    category: "downloader",
    permissions: {
        oremium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/threads", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.media;

            for (const media of result) {
                const mediaType = media.type.toLowerCase();

                if (mediaType === "video" && media.videoUrl) {
                    await ctx.reply({
                        video: {
                            url: media.videoUrl
                        },
                        mimetype: mime.lookup("mp4")
                    });
                } else if (mediaType === "image" && media.url) {
                    await ctx.reply({
                        image: {
                            url: media.url
                        },
                        mimetype: mime.lookup("png")
                    });
                }
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};