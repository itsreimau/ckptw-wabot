const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw')

module.exports = {
    name: 'meme',
    category: 'fun',
    code: async (ctx) => {
        const apiUrl = createAPIUrl('https://candaan-api.vercel.app', '/api/image/random', {});

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const imageUrl = data.data.url;

            return ctx.reply({
                image: {
                    url: imageUrl
                },
                caption: `• Sumber: ${data.data.source}`
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};