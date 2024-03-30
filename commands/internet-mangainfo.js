const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'animeinfo',
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
            const response = fetch(apiUrl);
            const data = await response.json();

            if (!data) return ctx.reply(global.msg.notFound);

            let {
                title,
                title_japanese,
                synopsis,
                chapters,
                url,
                volumes,
                score,
                images.jpg.image_url
            } = data.data[0]
            return ctx.sendMessage(ctx.id, {
                text: `Judul: ${title} (${title_japanese})\n` +
                    `Bab: ${chapters}\n` +
                    `Volume: ${volumes}\n` +
                    `Skor: ${score}\n` +
                    `Ringkasan: ${synopsis}\n` +
                    `URL: ${url}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'M A N G A I N F O',
                        body: null,
                        thumbnailUrl: images.jpg.image_url,
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