const {
    crypto
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'crypto',
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kejadian`)}`
        );

        try {
            const result = await crypto(input);

            if (!result) throw new Error(global.msg.notFound);

            const resultText = result.map(r =>
                `➤ Nama: ${r.cryptoName}\n` +
                `➤ Harga: ${r.priceChange}`
            ).join('\n-----\n');
            return ctx.reply(
                `❖ ${bold('Crypto')}\n` +
                `\n` +
                resultText +
                `\n` +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};