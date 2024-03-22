const {
    alkitab
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
    name: 'alkitab',
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kejadian`)}`
        );

        try {
            const result = await alkitab(input);

            if (!result) return ctx.reply(global.msg.notFound);

            ctx.reply(result.map(v =>
                `• ${v.title}\n` +
                `• ${v.text}`
            ).join('\n────────\n'))
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};