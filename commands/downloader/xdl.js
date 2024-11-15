const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "xdl",
    aliases: ["twit", "twitdl", "twitter", "twitterdl", "x"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        premium: true
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
            const apiUrl = tools.api.createUrl("ryzendesu", "/api/downloader/twitter", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            if (data.status && data.type === "image" && data.media.length > 0) {
                for (let i = 0; i < data.media.length; i++) {
                    await ctx.reply({
                        image: {
                            url: data.media[i]
                        },
                        mimetype: mime.lookup("png")
                    });
                }
            }

            if (data.status && data.type === "video" && data.media.length > 0) {
                for (let i = 0; i < data.media.length; i++) {
                    const videoData = data.media[i];
                    await ctx.reply({
                        video: {
                            url: videoData.url
                        },
                        mimetype: mime.lookup("mp4"),
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