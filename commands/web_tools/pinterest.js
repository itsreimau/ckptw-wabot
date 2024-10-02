const {
    ButtonBuilder,
    CarouselBuilder,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "pinterest",
    aliases: ["pin", "pint"],
    category: "web_tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true,
            coin: [10, "text", 1]
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat")
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/pinsearch", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (input.includes("-s") && global.config.system.useInteractiveMessage) {
                const randomResults = Array.from({
                    length: 5
                }, () => global.tools.general.getRandomElement(data));
                const cards = new CarouselBuilder();

                for (let i = 0; i < randomResults.length; i++) {
                    const imagesUrl = randomResults[i].images_imagesUrl;
                    const button = new ButtonBuilder()
                        .setId(`id${i}`)
                        .setDisplayText("Image URL 🌐")
                        .setType("cta_url")
                        .setURL(randomResults[i].pin)
                        .setMerchantURL("https://www.google.ca")
                        .build();

                    const imagesMediaAttachment = await ctx.prepareWAMessageMedia({
                        image: {
                            imagesUrl
                        }
                    }, {
                        upload: ctx._client.waUploadToServer
                    });

                    cards.addCard({
                        body: `${quote(`Kueri: ${input}`)}\n` +
                            "\n" +
                            global.config.msg.footer,
                        footer: global.config.msg.watermark,
                        header: {
                            title: "Pinterest",
                            hasMediaAttachment: true,
                            ...imagesMediaAttachment
                        },
                        nativeFlowMessage: {
                            buttons: [button]
                        }
                    });
                }

                return ctx.replyInteractiveMessage({
                    body: global.config.msg.footer,
                    footer: global.config.msg.watermark,
                    carouselMessage: {
                        cards: cards.build()
                    }
                });
            }

            const result = global.tools.general.getRandomElement(data);
            return await ctx.reply({
                image: {
                    imagesUrl: result.imagesUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    `${quote(`Gunakan ${monospace("-s")} jika Anda ingin gambarnya berupa slide.`)}\n` +
                    `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat -a"))}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};