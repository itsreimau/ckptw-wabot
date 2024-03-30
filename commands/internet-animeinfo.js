const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('@vitalets/google-translate-api');

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
            const {
                text
            } = await translate(info.synopsis, {
                to: 'id'
            });
            return ctx.sendMessage(ctx.id, {
                text: `• Judul: ${info.title}\n` +
                    `• Judul (Inggris): ${info.title_english}\n` +
                    `• Judul (Jepang): ${info.title_japanese}\n` +
                    `• Tipe: ${info.type}\n` +
                    `• Episode: ${info.episodes}\n` +
                    `• Durasi: ${info.duration}\n` +
                    `• Ringkasan: ${text}\n` +
                    `• URL: ${info.url}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'A N I M E I N F O',
                        body: null,
                        thumbnailUrl: info.images.jpg.large_image_url,
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