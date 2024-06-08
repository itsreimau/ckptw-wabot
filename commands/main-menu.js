const {
    getMenu
} = require("../tools/menu.js");
const {
    getRandomElement
} = require("../tools/simple.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const fg = require("api-dylux");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "main",
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);

            if (global.system.useInteractiveMessage) {
                const messageContent = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: text
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: global.msg.footer
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: global.bot.name,
                                    subtitle: global.msg.watermark,
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                            name: "quick_reply",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: "🚀 Uptime",
                                                id: "/uptime"
                                            })
                                        },
                                        {
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: "🚻 Group Chat",
                                                url: global.bot.groupChat,
                                                merchant_url: global.bot.groupChat
                                            })
                                        },
                                        {
                                            name: "cta_call",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: "📞 Owner",
                                                id: `+${global.owner.number}`
                                            })
                                        }
                                    ]
                                })
                            })
                        }
                    }
                };
                const InteractiveMessage = generateWAMessageFromContent(ctx.chat, messageContent, {});

                return await ctx._client.relayMessage(ctx.id, InteractiveMessage.message, {
                    messageId: ctx._msg.key.id
                });
            }

            return ctx.sendMessage(
                ctx.id, {
                    text: text,
                    contextInfo: {
                        externalAdReply: {
                            title: global.msg.watermark,
                            body: null,
                            thumbnailUrl: global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};