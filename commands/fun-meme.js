const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const mime = require('mime-types');

module.exports = {
    name: 'meme',
    category: 'fun',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = createAPIUrl('https://candaan-api.vercel.app', '/api/image/random', {});

        try {
            const response = await axios.get(apiUrl);
            const data = await response.data;
            const imageUrl = data.data.url;

            if (!imageUrl) throw new Error(global.msg.notFound);

            return ctx.reply({
                image: {
                    url: imageUrl
                },
                mimetype: mime.contentType('png'),
                caption: `❖ ${bold('Meme')}\n` +
                    '\n' +
                    `➤ Sumber: ${data.data.source}\n` +
                    '\n' +
                    global.msg.footer,
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};