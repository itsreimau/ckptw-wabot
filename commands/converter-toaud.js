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
    name: 'toaud',
    aliases: ['tomp3', 'toaudio'],
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'videoMessage') ? await download(object, type.slice(0, -7)) : null;

            const audBuffer = await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(buffer)
                    .noVideo()
                    .audioCodec('libmp3lame')
                    .audioQuality(4)
                    .format('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .pipe();
            });

            return ctx.reply({
                audio: audBuffer,
                caption: null
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};