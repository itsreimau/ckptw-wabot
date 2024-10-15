const {
    ButtonBuilder,
    CarouselBuilder,
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
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const flag = global.tools.general.parseFlag(input, {
            "-s": {
                type: "boolean",
                key: "slide"
            }
        });

        const url = flag.input || null;

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return await ctx.reply(global.config.msg.urlInvalid);

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
                    if (flag.slide && global.config.system.useInteractiveMessage) {
                        const cards = new CarouselBuilder();

                        for (let i = 0; i < data.images.length; i++) {
                            const imageUrl = data.images[i].url;
                            const button = new ButtonBuilder()
                                .setId(`img${i}`)
                                .setDisplayText("Image URL 🌐")
                                .setType("cta_url")
                                .setURL(imageUrl)
                                .build();

                            const imagesMediaAttachment = await ctx.prepareWAMessageMedia({
                                image: {
                                    url: imageUrl
                                }
                            }, {
                                upload: ctx._client.waUploadToServer
                            });

                            cards.addCard({
                                body: global.config.msg.footer,
                                footer: global.config.msg.watermark,
                                header: {
                                    title: "TikTok Image",
                                    hasMediaAttachment: true,
                                    ...imagesMediaAttachment
                                },
                                nativeFlowMessage: {
                                    buttons: [button]
                                }
                            });
                        }

                        return await ctx.replyInteractiveMessage({
                            body: `${quote(`Kueri: ${url}`)}\n` +
                                "\n" +
                                global.config.msg.footer,
                            footer: global.config.msg.watermark,
                            carouselMessage: {
                                cards: cards.build()
                            }
                        });
                    }

                    if (flag.slide && !global.config.system.useInteractiveMessage) await ctx.reply(global.config.msg.useInteractiveMessage);

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
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};