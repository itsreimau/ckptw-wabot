const {
    handler
} = require('../handler.js');
const {
    googlesearch
} = require('../tools/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'googlesearch',
    aliases: ['google'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
        );

        try {
            const result = await googlesearch(input);

            if (!result) throw new Error(global.msg.notFound);

            const resultText = result.map(r =>
                `➤ Judul: ${r.title}\n` +
                `➤ Deskripsi: ${r.snippet}\n` +
                `➤ URL: ${r.url}`
            ).join('\n-----\n');
            return ctx.reply(
                `❖ ${bold('Google Search')}\n` +
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