const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'megumin',
    category: 'internet',
    code: async (ctx) => {
        const apiUrl = createAPIUrl('https://api.waifu.pics', '/sfw/megumin');

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            await ctx.reply({
                image: {
                    url: data.url
                },
                caption: 'Waga na wa Megumin! Ākuwizādo wo nariwai toshi, s-saikyou no k-kougeki no mahou "bakuretsu mahou" wo a-ayatsuru mono! Explosion!'
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};