const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'pixart',
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');
        const styleList = [...Array(9).keys()].map((index) => `${index + 1}. ${getStyleText(index + 1)}`).join('\n');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7|cat`)}\n` +
            `Daftar gaya:\n` +
            `${styleList}`
        );

        try {
            const [styles, prompt] = input.split('|');

            if (isNaN(styles) || styles < 1 || styles > 9) return ctx.reply(
                `${bold('[ ! ]')} Masukkan gaya yang tersedia.\n` +
                `Daftar gaya:\n${styleList}`
            );

            const apiUrl = createAPIUrl('ai_tools', '/pixart', {
                prompt: prompt.trim(),
                styles: styles
            });

            const filePath = path.join(__dirname, '..', 'tmp', `IMG-${ctx._msg.messageTimestamp}`);

            const response = await fetch(apiUrl);
            const buffer = await response.buffer();
            fs.writeFileSync(filePath, buffer);

            await ctx.reply({
                image: {
                    url: filePath
                },
                caption: `• Prompt: ${prompt.trim()}\n` +
                    `• Gaya: ${getStyleText(styles)}`
            });

            fs.unlinkSync(filePath);
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