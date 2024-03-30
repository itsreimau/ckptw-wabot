const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

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
            const data = await response.json();

            if (!data) return ctx.reply(global.msg.notFound);

            const info = data.data[0];
            return ctx.sendMessage(ctx.id, {
                text: `• Judul: ${info.title} (${info.title_english})\n` +
                    `• Episode: ${info.episodes}\n` +
                    `• Peringkat: ${info.rated}\n` +
                    `• Skor: ${info.score}\n` +
                    `• Ringkasan:* ${info.synopsis}\n` +
                    `• URL: ${info.url}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'A N I M E I N F O',
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