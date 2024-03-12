require('../config.js');
const {
    createAPIUrl
} = require('../lib/api.js');
const {
    download
} = require('../lib/simple.js');
const {
    bold,
    monospace
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
    aliases: ['stikermeme', 'smeme'],
    category: 'converter',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei|ayanami`)}`
        );

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar, GIF, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            const [top, bottom] = input.split(`|`);
            const result = await uploadByBuffer(buffer, 'image/png');
            const memegen = createAPIUrl('https://api.memegen.link', `/images/custom/${top || ''}/${encodeURIComponent(bottom || '')}.png`, {
                background: result.link
            });

            const sticker = new Sticker(memegen, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: ctx.id,
                quality: 50,
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};