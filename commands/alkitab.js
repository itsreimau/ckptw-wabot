const {
    createAPIUrl
} = require('../lib/api.js');
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
            const apiUrl = createAPIUrl('https://alkitab.me', '/search', {
                q: input
            })
            const res = await axios.get(apiUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
                }
            })

            const $ = cheerio.load(res.data)
            const result = []
            $('div.vw').each(function(a, b) {
                const teks = $(b).find('p').text().trim()
                const link = $(b).find('a').attr('href')
                const title = $(b).find('a').text().trim()
                result.push({
                    teks,
                    link,
                    title
                })
            })

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