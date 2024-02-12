require('../config.js');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');
const {
    sendStatus
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'sticker',
    aliases: ['stiker', 's'],
    category: 'converter',
    code: async (ctx) => {
        sendStatus(ctx, 'processing');

        if (ctx.getMessageType() !== MessageType.imageMessage && ctx.getMessageType() !== MessageType.videoMessage) return ctx.reply(`${bold('[ ! ]')} Berikan gambar!`).then(() => sendStatus(ctx, 'noRequest'));

        try {
            const buffer = await ctx.getMediaMessage(ctx.msg, 'buffer');

            const stickerOptions = {
                pack: global.packname,
                author: global.author,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: ctx.id,
                quality: 50,
            };

            const sticker = new Sticker(buffer, stickerOptions);

            await ctx.reply(await sticker.toMessage()).then(() => sendStatus(ctx, 'success'));
        } catch (error) {
            console.error('Error', error);
            ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`).then(() => sendStatus(ctx, 'failure'));
        }
    },
};