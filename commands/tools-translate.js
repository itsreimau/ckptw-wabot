const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'translate',
    aliases: ['tr'],
    category: 'tools',
    code: async (ctx) => {
        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo dunia!`)}`
        );

        try {
            const [lang, ...inp] = ctx._args;
            const result = await translate(inp.join(' '), null, lang);

            await ctx.reply(result.translation);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};