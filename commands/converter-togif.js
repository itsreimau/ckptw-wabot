const {
    handler
} = require('../handler.js');
const {
    download
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'togif',
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa stiker, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7)) : null;

            return ctx.reply({
                video: buffer,
                caption: null,
                gifPlayback: true
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};