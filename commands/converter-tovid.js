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

module.exports = {
    name: 'tovid',
    aliases: ['tovideo'],
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
            const media = await webp2mp4File(await buffer);

            return ctx.reply({
                video: media,
                caption: null,
                gifPlayback: false
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};