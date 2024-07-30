const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const axios = require("axios");

module.exports = {
    name: "ttdl",
    aliases: ["tiktokdl", "tiktokmp3", "tiktoknowm", "tt", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vt", "vta", "vtaudio", "vtdltiktok", "vtmp3", "vtmusic", "vtmusik", "vtnowm"],
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

        const input = ctx._args.join(" ").trim();

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{39}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const audioCommands = ["tiktokmp3", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vta", "vtaudio", "vtmp3", "vtmusic", "vtmusik"];
            const mediaType = audioCommands.includes(ctx._used.command) ? "audio" : "video_image";

            const apiUrl = createAPIUrl("https://api.tiklydown.eu.org", "/api/download", {
                url: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: data.music.play_url
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (mediaType === "video_image") {
                if (data.video?.noWatermark) {
                    return await ctx.reply({
                        video: {
                            url: data.video.noWatermark
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: `❖ ${bold("TT Downloader")}\n` +
                            "\n" +
                            `➲ URL: ${input}\n` +
                            "\n" +
                            global.msg.footer,
                        gifPlayback: false,
                    });
                }

                if (data.images && data.images.length > 0) {
                    await ctx.reply(`${bold("[ ! ]")} Gambar terdeteksi! Bot akan mengirimkan gambar secara berurutan.`);
                    for (const image of data.images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png"),
                            caption: `❖ ${bold("TT Downloader")}\n` +
                                "\n" +
                                `➲ URL: ${input}\n` +
                                "\n" +
                                global.msg.footer,
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};