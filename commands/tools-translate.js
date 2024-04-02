const {
    translate
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'translate',
    aliases: ['tr'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo dunia!`)}`
        );

        try {
            const [lang, ...inp] = input.split(' ');
            const result = await googleTranslate(inp.join(' '), 'auto', lang);

            await ctx.reply(result);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};