require('../config.js');
const {
    createAPIUrl
} = require('../lib/api.js');
const {
    Quoted
} = require('../lib/simple.js');
const {
    bold,
    quote
} = require('@mengkodingan/ckptw');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    uploadByBuffer
} = require('telegraph-uploader');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');

module.exports = {
    name: 'stickermeme',
    aliases: ['smeme'],
    category: 'converter',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks atas dan bawah yang dipisahkan dengan ${quote('|')}!`);

        let mediaMessage = ctx.msg.message.imageMessage;
        const isq = Quoted(ctx);

        if (isq.isQuoted && (isq.type === 'imageMessage')) {
            mediaMessage = isq.data.viaType;
        }

        if (mediaMessage) {
            if (mediaMessage.url === 'https://web.whatsapp.net') {
                mediaMessage.url = 'https://mmg.whatsapp.net' + mediaMessage.directPath;
            }

            try {
                const [top, bottom] = input.split(`|`);
                const stream = await require('@whiskeysockets/baileys').downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                const result = await uploadByBuffer(buffer, 'image/png');

                const meme = createAPIUrl('https://api.memegen.link', `/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png`, {
                    background: result.link
                });

                const s = new Sticker(meme, {
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
            return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar!`);
        }
    }
};