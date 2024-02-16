require('../config.js');
const {
    Quoted
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');

module.exports = {
    name: 'sticker',
    aliases: ['stiker', 's'],
    category: 'converter',
    code: async (ctx) => {
        let mediaMessage = ctx.msg.message.imageMessage || ctx.msg.message.videoMessage;
        const isq = Quoted(ctx);

        if (isq.isQuoted && (isq.type === 'imageMessage' || isq.type === 'videoMessage')) {
            mediaMessage = isq.data.viaType;
        }

        if (mediaMessage) {
            if (mediaMessage.url === 'https://web.whatsapp.net') {
                mediaMessage.url = 'https://mmg.whatsapp.net' + mediaMessage.directPath;
            }

            try {
                const stream = await require('@whiskeysockets/baileys').downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);

                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                const s = new Sticker(buffer, {
                    pack: global.sticker.packname,
                    author: global.sticker.author,
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: ctx.id,
                    quality: 50,
                });

                await ctx.reply(await s.toMessage());
            } catch (error) {
                console.error('Error:', error);
                return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
            }
        } else {
            return ctx.reply(`${bold('[ ! ]')} Berikan gambar atau balas gambar!`);
        }
    }
};