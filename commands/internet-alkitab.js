const {
    alkitab
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'alkitab',
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kejadian`)}`
        );

        try {
            const result = await alkitab(input);

            if (!result) return ctx.reply(global.msg.notFound);

            return ctx.reply(
                `${bold('Alkitab')}\n` +
                result.map(r =>
                    `• ${r.title}\n` +
                    `• ${r.text}`
                ).join('\n----\n')
                `\n` +
                global.msg.footer
            )
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};