const {
    bold
} = require('@mengkodingan/ckptw');
const {
    _ai
} = require('lowline.ai');

_ai.init({
    apiKey: 'REPLACE_THIS_WITH_YOUR_API_KEY' // Dapatkan di: https://www.lowline.ai/
});

module.exports = {
    name: 'chatgpt',
    aliases: ['ai'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks!`);

        try {
            const res = await _ai.generatePlaintext({
                prompt: input,
            });

            await ctx.reply(res.result);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};