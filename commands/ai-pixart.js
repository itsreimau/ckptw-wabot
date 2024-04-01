const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'pixart',
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');
        const styleList = [...Array(9).keys()].map((index) => `${index + 1}. ${getStyleText(index + 1)}`).join('\n');

        const readmore = '\u200E'.repeat(4001);

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7 cat`)}\n` +
            `${readmore}\n` +
            `Catatan: Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar gaya yang tersedia.`
        );

        if (input === 'list') return ctx.reply(
            `Daftar gaya:\n` +
            styleList
        )

        try {
            const [styles, ...prompt] = input.split(' ');

            if (isNaN(styles) || styles < 1 || styles > 9) return ctx.reply(`Masukkan gaya yang tersedia. Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar gaya yang tersedia.`);

            const apiUrl = createAPIUrl('ai_tools', '/pixart', {
                prompt: prompt.join(' '),
                styles: styles
            });

            await ctx.reply({
                image: {
                    url: apiUrl
                },
                caption: `❖ ${bold('Pixart')}\n` +
                    `\n` +
                    `• Prompt: ${prompt.join(' ')}\n` +
                    `• Gaya: ${getStyleText(styles)}\n` +
                    `\n` +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function getStyleText(styleNumber) {
    const styleTexts = ['Cinematic', 'Photographic', 'Anime', 'Manga', 'Digital Art', 'Pixel Art', 'Fantasy Art', 'Neonpunk', '3D Model'];

    return styleTexts[styleNumber - 1] || '';
}