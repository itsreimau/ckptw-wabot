const {
    ButtonBuilder,
    CarouselBuilder,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "googleimage",
    aliases: ["gimage"],
    category: "tools",
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
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))}\n` +
            quote(global.tools.msg.generatesFlagInformation({
                "-s": "Jenis pesan slide (carousel)."
            }))
        );

        try {
            const flag = global.tools.general.parseFlag(input, {
                "-s": {
                    type: "boolean",
                    key: "slide"
                }
            });

            const apiUrl = global.tools.api.createUrl("widipe", "/googleimage", {
                query: flag.input
            });
            const data = (await axios.get(apiUrl)).data.result;

            if (flag.slide && global.config.system.useInteractiveMessage) {
                const randomResults = data.sort(() => 0.5 - Math.random()).slice(0, 5);

                const cards = new CarouselBuilder();

                for (let i = 0; i < randomResults.length; i++) {
                    const url = randomResults[i].url;
                    const button = new ButtonBuilder()
                        .setId(`id${i}`)
                        .setDisplayText("Image URL 🌐")
                        .setType("cta_url")
                        .setURL(url)
                        .setMerchantURL("https://www.google.ca")
                        .build();

                    const imageMediaAttachment = await ctx.prepareWAMessageMedia({
                        image: {
                            url
                        }
                    }, {
                        upload: ctx._client.waUploadToServer
                    });

                    cards.addCard({
                        body: global.config.msg.footer,
                        footer: global.config.msg.watermark,
                        header: {
                            title: "Google Image",
                            hasMediaAttachment: true,
                            ...imageMediaAttachment
                        },
                        nativeFlowMessage: {
                            buttons: [button]
                        }
                    });
                }

                return await ctx.replyInteractiveMessage({
                    body: `${quote(`Kueri: ${flag.input}`)}\n` +
                        "\n" +
                        global.config.msg.footer,
                    footer: global.config.msg.watermark,
                    carouselMessage: {
                        cards: cards.build()
                    }
                });
            }

            if (flag.slide && !global.config.system.useInteractiveMessage) await ctx.reply(global.config.msg.useInteractiveMessage);

            const result = global.tools.general.getRandomElement(data);
            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    `${quote(`Gunakan ${monospace("-s")} jika Anda ingin gambarnya berupa slide.`)}\n` +
                    `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat -s"))}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};