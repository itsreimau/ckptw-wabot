const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'neko',
    category: 'internet',
    code: async (ctx) => {
        const apiUrl = createAPIUrl('https://api.waifu.pics', '/sfw/neko');

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            await ctx.reply({
                image: {
                    url: data.url
                },
                caption: 'Miaw! >///<'
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};