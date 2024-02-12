require('../config.js');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'sticker',
    aliases: ['stiker', 's'],
    category: 'converter',
    code: async (ctx) => {
        if (ctx.getMessageType() !== MessageType.imageMessage && ctx.getMessageType() !== MessageType.videoMessage) return ctx.reply(`${bold('[ ! ]')} Berikan gambar!`);
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

            await ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};