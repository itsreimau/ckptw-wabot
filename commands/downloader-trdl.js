const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "trdl",
    aliases: ["tr", "threads", "threadsdl"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/threads", {
                url
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

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
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};