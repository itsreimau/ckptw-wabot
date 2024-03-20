require('../config.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    _ai
} = require('lowline.ai');

module.exports = {
    name: 'lowline',
    aliases: ['lowlineai', 'llai', 'll'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
        );

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