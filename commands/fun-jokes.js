const {
    handler
} = require('../handler.js');
const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw')

module.exports = {
    name: 'jokes',
    category: 'fun',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = createAPIUrl('https://candaan-api.vercel.app', '/api/text/random', {});

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(global.msg.notFound);

            const {
                data
            } = await response.json();

            return ctx.reply(data);
        } catch (error) {
            console.error('Error:', error);
            return message.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};