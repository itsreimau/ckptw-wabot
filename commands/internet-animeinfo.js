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
    name: 'animeinfo',
    aliases: ['anime'],
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl('https://api.jikan.moe', '/v4/anime', {
                q: input
            });
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(global.msg.notFound);

            const data = await response.json();
            const info = data.data[0];
            const synopsisId = await translate(info.synopsis, 'en', 'id');

            return ctx.reply({
                image: {
                    url: info.images.jpg.large_image_url
                },
                caption: `❖ ${bold('Anime Info')}\n` +
                    '\n' +
                    `➤ Judul: ${info.title}\n` +
                    `➤ Judul (Inggris): ${info.title_english}\n` +
                    `➤ Judul (Jepang): ${info.title_japanese}\n` +
                    `➤ Tipe: ${info.type}\n` +
                    `➤ Episode: ${info.episodes}\n` +
                    `➤ Durasi: ${info.duration}\n` +
                    `➤ Ringkasan: ${synopsisId.translation}\n` +
                    `➤ URL: ${info.url}\n` +
                    '\n' +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};