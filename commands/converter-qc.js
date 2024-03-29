const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');

module.exports = {
    name: 'qc',
    category: 'converter',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo dunia!`)}`
        );

        try {
            const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            const replyMsg = quotedMessage ? {
                qname: null,
                qtext: quotedMessage.conversation
            } : {}

            const pp = await ctx._client.profilePictureUrl(ctx._sender.jid, 'image').catch(_ => 'https://telegra.ph/file/a2ae6cbfa40f6eeea0cf1.jpg');

            const obj = {
                'type': 'quote',
                'format': 'png',
                'backgroundColor': '#111111',
                'width': 512,
                'height': 768,
                'scale': 2,
                'messages': [{
                    'entities': [],
                    'avatar': true,
                    'from': {
                        'id': ctx._sender.jid,
                        'name': ctx._sender.pushName,
                        'photo': {
                            'url': pp
                        }
                    },
                    'text': input,
                    'replyMessage': {
                        replyMsg
                    }
                }]
            };

            const data = await axios.post('https://bot.lyo.su/quote/generate', obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const buffer = Buffer.from(data.result.image, 'base64');

            const sticker = new Sticker(buffer, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: ctx.id,
                quality: 50,
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};