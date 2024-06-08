const {
    getRandomElement
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const axios = require("axios");
const fg = require("api-dylux");
const mime = require("mime-types");

module.exports = {
    name: "googleimage",
    aliases: ["gimage"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei ayanami`)}`
        );

        try {
            const result = await fg.googleImage(input);

            if (!result) throw new Error(global.msg.notFound);

            const imageUrl = getRandomElement(result);
            const imageResponse = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });
            const buffer = Buffer.from(imageResponse.data, "binary");

            if (global.system.useInteractiveMessage) {
                const InteractiveMessage = generateWAMessageFromContent(ctx.id, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `❖ ${bold("Google Image")}\n` +
                                        "\n" +
                                        `➲ Kueri: ${input}\n` +
                                        "\n" +
                                        global.msg.footer
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: global.bot.name,
                                    hasMediaAttachment: true,
                                    imageMessage: await createImageMessage(ctx, buffer)
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                        name: "quick_reply",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "🔄 Again",
                                            id: `${ctx._used.prefix + ctx._used.command} ${input}`
                                        })
                                    }]
                                })
                            })
                        }
                    }
                }, {});

                return await ctx._client.relayMessage(ctx.id, InteractiveMessage.message, {
                    messageId: ctx._msg.key.id
                });
            }

            return await ctx.reply({
                image: buffer,
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Google Image")}\n` +
                    "\n" +
                    `➲ Kueri: ${input}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

async function createImageMessage(ctx, image) {
    const {
        imageMessage
    } = await generateWAMessageContent({
        image: {
            image
        }
    }, {
        upload: ctx._client.waUploadToServer
    });

    return imageMessage;
};