const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
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

        const input = ctx.args[0] || null;

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
            const apiUrl = global.tools.api.createUrl("https://vkrdownloader.vercel.app", "/server", {
                vkr: url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (flag.slide && global.config.system.useInteractiveMessage) {
                const cards = new CarouselBuilder();

                for (let i = 0; i < data.downloads.length; i++) {
                    const download = data.downloads[i];
                    const fileType = mime.lookup(download.extension);

                    let mediaType = null;
                    let mediaOptions = null;

                    if (fileType.startsWith("image")) {
                        mediaType = "image";
                        mediaOptions = {
                            image: {
                                url: download.url
                            }
                        };
                    } else if (fileType.startsWith("video")) {
                        mediaType = "video";
                        mediaOptions = {
                            video: {
                                url: download.url
                            }
                        };
                    }

                    const mediaAttachment = await ctx.prepareWAMessageMedia(mediaOptions, {
                        upload: ctx._client.waUploadToServer
                    });

                    const button = new ButtonBuilder()
                        .setId(`id${i}`)
                        .setDisplayText(mediaType === "image" ? "Image URL 🌐" : "Video URL 🌐")
                        .setType("cta_url")
                        .setURL(download.url)
                        .build();

                    cards.addCard({
                        body: global.config.msg.footer,
                        footer: global.config.msg.watermark,
                        header: {
                            title: mediaType === "image" ? "Instagram Image" : "Instagram Video",
                            hasMediaAttachment: true,
                            ...mediaAttachment
                        },
                        nativeFlowMessage: {
                            buttons: [button]
                        }
                    });
                }

                return await ctx.replyInteractiveMessage({
                    body: `${quote(`URL: ${url}`)}\n` +
                        "\n" +
                        global.config.msg.footer,
                    footer: global.config.msg.watermark,
                    carouselMessage: {
                        cards: cards.build()
                    }
                });
            }

            if (flag.slide && !global.config.system.useInteractiveMessage) await ctx.reply(global.config.msg.useInteractiveMessage);

            if (data.downloads && data.downloads.length > 0) {
                for (const download of data.downloads) {
                    const fileType = mime.lookup(download.extension);

                    if (fileType.startsWith("video")) {
                        await ctx.reply({
                            video: {
                                url: download.url
                            },
                            mimetype: fileType
                        });
                    } else if (fileType.startsWith("image")) {
                        await ctx.reply({
                            image: {
                                url: download.url
                            },
                            mimetype: fileType
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