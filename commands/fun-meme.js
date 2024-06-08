const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "meme",
    category: "fun",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = createAPIUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const response = await axios.get(apiUrl);
            const data = await response.data;
            const imageUrl = data.data.url;

            if (!imageUrl) throw new Error(global.msg.notFound);

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
                                    text: `❖ ${bold("Meme")}\n` +
                                        "\n" +
                                        `➲ Sumber: ${data.data.source}\n` +
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
                                            display_text: "Again 🔄",
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

            return ctx.reply({
                image: buffer,
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Meme")}\n` +
                    "\n" +
                    `➲ Sumber: ${data.data.source}\n` +
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