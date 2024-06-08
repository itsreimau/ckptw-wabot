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

module.exports = {
    name: "jokes",
    category: "fun",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = createAPIUrl("https://candaan-api.vercel.app", "/api/text/random", {});

        try {
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const {
                data
            } = await response.data;

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
                                    text: data
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "Jokes",
                                    subtitle: global.msg.watermark,
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                        name: "quick_reply",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "Again 🔄",
                                            id: ctx._used.prefix + ctx._used.command
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

            return ctx.reply(data);
        } catch (error) {
            console.error("Error:", error);
            return message.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};