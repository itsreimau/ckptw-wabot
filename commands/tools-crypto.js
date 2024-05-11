const {
    coingecko
} = require('../tools/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'crypto',
    aliases: ['coingecko'],
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bitcoin`)}`
        );

        try {
            const result = await coingecko(input);

            if (!result) throw new Error(global.msg.notFound);

            const resultText = result.map(r =>
                `➤ ${r.cryptoName}\n` +
                `➤ Harga: ${r.priceChange}`
            ).join('\n-----\n');
            return ctx.reply(
                `❖ ${bold('Crypto')}\n` +
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