const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

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

            if (!data) return ctx.reply(global.msg.notFound);

            const info = data.data[0];
            return ctx.sendMessage(ctx.id, {
                text: `Judul: ${info.title} (${info.title_japanese})\n` +
                    `Bab: ${info.chapters}\n` +
                    `Volume: ${info.volumes}\n` +
                    `Skor: ${info.score}\n` +
                    `Ringkasan: ${info.synopsis}\n` +
                    `URL: ${info.url}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'M A N G A I N F O',
                        body: null,
                        thumbnailUrl: info.images.jpg.image_url,
                        sourceUrl: global.bot.groupChat,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: ctx._msg
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};