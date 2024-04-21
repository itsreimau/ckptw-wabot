const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'mangainfo',
    aliases: ['manga'],
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl('https://api.jikan.moe', '/v4/manga', {
                q: input
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data) throw new Error(global.msg.notFound);

            const info = data.data[0];
            const synopsisId = await translate(info.synopsis, 'en', 'id');
            return ctx.reply({
                image: {
                    url: info.images.jpg.large_image_url
                },
                caption: `❖ ${bold('Manga Info')}\n` +
                    `\n` +
                    `➤ Judul: ${info.title}\n` +
                    `➤ Judul (Inggris): ${info.title_english}\n` +
                    `➤ Judul (Jepang): ${info.title_japanese}\n` +
                    `➤ Tipe: ${info.type}\n` +
                    `➤ Bab: ${info.chapters}\n` +
                    `➤ Volume: ${info.volumes}\n` +
                    `➤ Ringkasan: ${synopsisId.translation}\n` +
                    `➤ URL: ${info.url}\n` +
                    `\n` +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};