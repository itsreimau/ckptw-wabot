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
    name: 'togif',
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.stickerMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa stiker, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7)) : null;

            const gifBuffer = await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(buffer)
                    .outputOptions('-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2')
                    .outputOptions('-r', '10')
                    .videoCodec('libx264')
                    .format('mp4')
                    .on('end', resolve)
                    .on('error', reject)
                    .pipe();
            });

            return ctx.reply({
                video: gifBuffer,
                caption: null,
                gifPlayback: true
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};