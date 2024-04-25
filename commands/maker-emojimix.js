const {
    handler
} = require('../handler.js');
const {
    createAPIUrl
} = require('../lib/api.js');
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
    category: 'maker',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 😱 🤓`)}`
        );

        try {
            const [emoji1, emoji2] = ctx._args;
            const apiUrl = createAPIUrl('https://tenor.googleapis.com', `/v2/featured`, {
                key: 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ',
                contentfilter: 'high',
                media_filter: 'png_transparent',
                component: 'proactive',
                collection: 'emoji_kitchen_v5',
                q: `${emoji1}_${emoji2}`
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            const sticker = new Sticker(data.results[0].url, {
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