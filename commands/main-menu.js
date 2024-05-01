const package = require('../package.json');
const {
    getMenu
} = require('../tools/menu.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    generateWAMessageFromContent,
    proto
} = require('@whiskeysockets/baileys');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);
            const msg = generateWAMessageFromContent(ctx.id, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
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
                                        buttonParamsJson: `{"display_text":"🌐 Group","url":"${global.bot.groupChat}","merchant_url":"https://www.google.com"}`
                                    },
                                    {
                                        name: 'cta_url',
                                        buttonParamsJson: '{"display_text":"🌐 Website","url":"https://youtube.com/@DGXeon","merchant_url":"https://www.google.com"}'
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: {
                                            display_text: 'Owner 👤',
                                            id: `${ctx._used.command}owner`
                                        }
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: {
                                            display_text: 'Script 📃',
                                            id: `${ctx._used.command}scrip`
                                        }
                                    }
                                ],
                            })
                        })
                    }
                }
            }, {
                quoted: ctx._msg
            });

            return await ctx._client.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};