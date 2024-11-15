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
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const isValidUrl = tools.general.isValidUrl(url);
        if (!isValidUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/threads", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (data.image_urls && data.image_urls.length > 0) {
                for (const imageUrl of data.image_urls) {
                    await ctx.reply({
                        image: {
                            url: imageUrl
                        },
                        mimetype: mime.contentType("png"),
                    });
                }
            }

            if (data.video_urls && data.video_urls.length > 0) {
                for (const videoUrl of data.video_urls) {
                    await ctx.reply({
                        video: {
                            url: videoUrl
                        },
                        mimetype: mime.contentType("mp4"),
                        gifPlayback: false
                    });
                }
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};