const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'faktaunik',
    aliases: ['fakta'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = await createAPIUrl('https://uselessfacts.jsph.pl', '/api/v2/facts/random', {});

        try {
            const response = await axios.get(apiUrl);

            const isResponseOk = (status) => status >= 200 && status < 300;
            if (!isResponseOk(response.status)) throw new Error(global.msg.notFound);

            const data = await response.data;
            const result = await translate(data.text, 'en', 'id');

            return ctx.reply(result.translation);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};