const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'faktaunik',
    aliases: ['fakta'],
    category: 'internet',
    code: async (ctx) => {
        const apiUrl = await createAPIUrl('https://uselessfacts.jsph.pl', '/api/v2/facts/random', {
            q: input
        });

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data) throw new Error(global.msg.notFound);

            const result = await translate(data.text, 'en', 'id');
            return ctx.reply(result);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};