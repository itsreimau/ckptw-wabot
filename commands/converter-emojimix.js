require('../config.js');
const {
    createAPIUrl
} = require('../lib/api.js');
const {
    getImageLink
} = require('../lib/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');

module.exports = {
    name: 'emix',
    aliases: ['emix'],
    category: 'converter',
    code: async (ctx) => {
        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 😱 🤓`)}`
        );

        try {
            const [emoji1, emoji2] = ctx._args;
            const apiUrl = createAPIUrl('itzpire', `/maker/emojimix`, {
                emoji1: emoji1,
                emoji2: emoji2
            });

            const sticker = new Sticker(apiUrl, {
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