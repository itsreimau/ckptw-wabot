const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const axios = require('axios');

module.exports = {
    name: 'jokes',
    category: 'fun',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = createAPIUrl('https://candaan-api.vercel.app', '/api/text/random', {});

        try {
            const response = await axios.get(apiUrl);

            const isResponseOk = (status) => status >= 200 && status < 300;
            if (!isResponseOk(response.status)) throw new Error(global.msg.notFound);

            const {
                data
            } = await response.data;

            return ctx.reply(data);
        } catch (error) {
            console.error('Error:', error);
            return message.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};