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
            const msg = generateWAMessageFromContent(ctx.id, {
                viewOnceMessage: {
                    message: {
                        "messageContextInfo": {
                            "deviceListMetadata": {},
                            "deviceListMetadataVersion": 2
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
                                        "name": "cta_url",
                                        "buttonParamsJson": "{\"display_text\":\"🌐 WhatsApp\",\"url\":\"https://whatsapp.com/channel/0029VaG9VfPKWEKk1rxTQD20\",\"merchant_url\":\"https://www.google.com\"}"
                                    },
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": {
                                            "display_text": "👤 Owner",
                                            "id": `${ctx._used.command}owner`
                                        }
                                    }
                                ],
                            })
                        })
                    }
                }
            }, {})

            return await ctx._client.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id
            });
        } catch (error) {
            console.error('Error:', error);
            ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};