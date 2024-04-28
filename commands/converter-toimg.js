const {
    handler
} = require('../handler.js');
const {
    download
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const ffmpeg = require('fluent-ffmpeg');

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

            const imgBuffer = await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(buffer)
                    .outputOptions('-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2')
                    .outputOptions('-frames:v', '1')
                    .outputFormat('image2')
                    .outputOptions('-f', 'image2pipe')
                    .pipe()
                    .on('end', resolve)
                    .on('error', reject);
            });

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