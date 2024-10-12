const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ttdl",
    aliases: ["tiktokdl", "tiktokmp3", "tiktoknowm", "tt", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vt", "vta", "vtaudio", "vtdltiktok", "vtmp3", "vtmusic", "vtmusik", "vtnowm"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => status && ctx.reply(message));

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.config.msg.urlInvalid);

        try {
            const audioCommands = ["tiktokmp3", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vta", "vtaudio", "vtmp3", "vtmusic", "vtmusik"];
            const mediaType = audioCommands.includes(ctx._used.command) ? "audio" : "video_image";

            const apiUrl = global.tools.api.createUrl("https://api.tiklydown.eu.org", "/api/download", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: data.music.play_url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (mediaType === "video_image") {
                if (data.video?.noWatermark) {
                    return await ctx.reply({
                        video: {
                            url: data.video.noWatermark
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: `${quote(`URL: ${url}`)}\n` +
                            "\n" +
                            global.config.msg.footer,
                        gifPlayback: false
                    });
                }

                if (data.images && data.images.length > 0) {
                    for (const image of data.images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png"),
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};