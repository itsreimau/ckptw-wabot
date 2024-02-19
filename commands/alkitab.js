const {
    alkitab
} = require('../lib/scraper.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
    name: 'alkitab',
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks pencarian!`);

        try {
            const result = await alkitab(input);

            ctx.reply(result.map(v =>
                `• ${v.title}\n` +
                `• ${v.teks}`
            ).join('\n────────\n'))
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};