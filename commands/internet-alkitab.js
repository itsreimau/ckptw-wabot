const {
    handler
} = require('../handler.js');
const {
    alkitab
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'alkitab',
    aliases: ['injil'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kejadian`)}`
        );

        try {
            const result = await alkitab(input);

            if (!result) throw new Error(global.msg.notFound);

            const resultText = result.map(r =>
                `➤ ${r.title}\n` +
                `➤ ${r.text}`
            ).join('\n-----\n');
            return ctx.reply(
                `❖ ${bold('Alkitab')}\n` +
                '\n' +
                `${resultText}\n` +
                '\n' +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};