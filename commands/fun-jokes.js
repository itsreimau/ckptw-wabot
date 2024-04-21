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
        const apiUrl = createAPIUrl('https://candaan-api.vercel.app', '/api/text/random', {});

        try {
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            if (!data) throw new Error(global.msg.notFound);

            return ctx.reply(data);
        } catch (error) {
            console.error('Error:', error);
            return message.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};