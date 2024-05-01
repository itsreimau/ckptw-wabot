const {
    getMenu
} = require('../tools/menu.js');
const {
    getRandomElement
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    generateWAMessageFromContent,
    proto
} = require('@whiskeysockets/baileys');
const fg = require('api-dylux');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);
            const thumbnail = await fg.googleImage('rei ayanami wallpaper');
            const imageUrl = getRandomElement(thumbnail) || global.bot.thumbnail;

            const interactiveMessage = proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: global.owner.name
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: global.bot.name
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: text,
                    subtitle: global.msg.watermark,
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [{
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 Group',
                                url: global.bot.groupChat,
                                merchant_url: 'https://www.google.com'
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 Website',
                                url: 'https://youtube.com/@DGXeon',
                                merchant_url: 'https://www.google.com'
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Owner 👤',
                                id: `${ctx._used.command}owner`
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Script 📃',
                                id: `${ctx._used.command}scrip`
                            })
                        }
                    ]
                })
            });

            const messageContent = {
                image: {
                    url: imageUrl
                },
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: interactiveMessage
                    }
                }
            };

            const msg = generateWAMessageFromContent(ctx.id, messageContent, {
                quoted: ctx._msg
            });

            return await ctx._client.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id
            });
        } catch (error) {
            console.error('Error:', error);
            ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};