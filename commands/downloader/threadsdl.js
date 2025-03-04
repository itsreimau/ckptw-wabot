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
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/threads", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data.media;

            for (const media of result) {
                if (media.type === "Video" && media.videoUrl) {
                    await ctx.reply({
                        video: {
                            url: media.videoUrl
                        },
                        mimetype: mime.lookup("mp4")
                    });
                } else if (media.type === "Image" && media.url) {
                    await ctx.reply({
                        image: {
                            url: media.url
                        },
                        mimetype: mime.lookup("png")
                    });
                }
            }
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};