const {
    handler
} = require('../handler.js');
const {
    download
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const fs = require('fs');
const {
    createCanvas,
    loadImage
} = require('canvas');

module.exports = {
    name: 'toimg',
    aliases: ['toimage'],
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa sticker!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7)) : null;
            const sticker = await loadImage(buffer);
            const canvas = createCanvas(sticker.width, sticker.height);
            const ctxCanvas = canvas.getContext('2d');
            ctxCanvas.drawImage(sticker, 0, 0, sticker.width, sticker.height);
            const imgBuffer = canvas.toBuffer('image/png');

            return ctx.reply({
                image: imgBuffer,
                caption: null
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};