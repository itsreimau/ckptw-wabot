const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "trdl",
    aliases: ["threads", "threadsdl"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.config.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/threads", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (data.image_urls && data.image_urls.length > 0) {
                for (const imageUrl of data.image_urls) {
                    ctx.reply({
                        image: {
                            url: imageUrl
                        },
                        mimetype: mime.contentType("png"),
                    });
                }
            }

            if (data.video_urls && data.video_urls.length > 0) {
                for (const videoUrl of data.video_urls) {
                    ctx.reply({
                        video: {
                            url: videoUrl
                        },
                        mimetype: mime.contentType("mp4"),
                        gifPlayback: false
                    });
                }
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};