const {
    handler
} = require('../handler.js');
const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter');

module.exports = {
    name: 'ttp',
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} get in the fucking robot, shinji!`)}`
        );

        try {
            const apiUrl = createAPIUrl('itzpire', `/maker/ttp`, {
                text: input
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