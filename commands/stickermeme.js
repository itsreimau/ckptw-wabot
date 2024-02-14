require('../config.js');
const {
    createAPIUrl
} = require('../lib/api.js');
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
const {
    uploadByBuffer
} = require('telegraph-uploader');

module.exports = {
    name: 'stickermeme',
    aliases: ['smeme'],
    category: 'converter',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks!`);

        if (ctx.getMessageType() !== MessageType.imageMessage && ctx.getMessageType() !== MessageType.videoMessage) {
            return ctx.reply(`${bold('[ ! ]')} Berikan gambar!`);
        }

        try {
            let [atas, bawah] = input.split(`|`);
            let img = await ctx.getMediaMessage(ctx.msg, 'buffer');
            let telegraphResult = await uploadByBuffer(img, 'image/png');

            let meme = createAPIUrl('https://api.memegen.link', `/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png`, {
                background: telegraphResult.link
            });

            const stickerOptions = {
                pack: global.packname,
                author: global.author,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: ctx.id,
                quality: 50,
            };

            const sticker = new Sticker(meme, stickerOptions);

            await ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};