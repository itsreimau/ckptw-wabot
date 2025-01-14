const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "threadsdl",
    aliases: ["threads"],
    category: "downloader",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/threads", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (data.media && data.media.length > 0) {
                for (const media of data.media) {
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
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};