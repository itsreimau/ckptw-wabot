const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('@vitalets/google-translate-api');

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
            const {
                text
            } = await translate(inp.join(' '), {
                to: lang
            });

            await ctx.reply(text);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};