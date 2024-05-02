const {
    handler
} = require('../handler.js');
const {
    download,
    webp2mp4File
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const mime = require('mime-types');

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

            if (quoted.isAnimated) {
                let media = await webp2mp4File(await buffer);
                await ctx.reply(video: media, caption: null, gifPlayback: false);
            }

            return ctx.reply({
                image: buffer,
                caption: null,
                mimetype: mime.contentType('png')
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};