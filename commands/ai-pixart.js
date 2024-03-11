const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'pixart',
    aliases: ['aipixart', 'imgpixart'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        const styleList = [...Array(9).keys()].map((index) => `${index + 1}. ${getStyleText(index + 1)}`).join('\n');

        if (!input.includes(' ')) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7 cat`)}` +
            `Daftar gaya:\n` +
            `${styleList}`
        );

        try {
            const spaceIndex = input.indexOf(' ');
            const styleInput = input.substring(0, spaceIndex);
            const prompt = input.substring(spaceIndex + 1).trim();
            const styles = parseInt(styleInput.trim());

            if (isNaN(styles) || styles < 1 || styles > 9) return ctx.reply(
                `${bold('[ ! ]')} Masukkan gaya yang tersedia.\n` +
                `Daftar gaya:\n` +
                `${styleList}`
            );

            const apiUrl = createAPIUrl('ai_tools', '/pixart', {
                prompt: prompt.trim(),
                styles: styles
            });

            await ctx.reply({
                image: {
                    url: apiUrl
                },
                caption: `• Prompt: ${prompt.trim()}\n` +
                    `• Gaya: ${getStyleText(styles)}`
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function getStyleText(styleNumber) {
    const styleTexts = [
        'Cinematic',
        'Photographic',
        'Anime',
        'Manga',
        'Digital Art',
        'Pixel Art',
        'Fantasy Art',
        'Neonpunk',
        '3D Model'
    ];

    return styleTexts[styleNumber - 1] || '';
};