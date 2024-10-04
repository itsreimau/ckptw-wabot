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
            const apiUrl = global.tools.api.createUrl("agatz", "/api/gimage", {
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

                return ctx.replyInteractiveMessage({
                    body: `${quote(`Kueri: ${input}`)}\n` +
                        "\n" +
                        global.config.msg.footer,
                    footer: global.config.msg.watermark,
                    carouselMessage: {
                        cards: cards.build()
                    }
                });
            }

            const result = global.tools.general.getRandomElement(data);
            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    `${quote(`Gunakan ${monospace("-s")} jika Anda ingin gambarnya berupa slide.`)}\n` +
                    `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat -s"))}\n` +
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