const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'lexicaart',
    aliases: ['lexica', 'lart'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks prompt!`);

        try {
            const apiUrl = createAPIUrl('vihangayt', `tools/lexicaart`, {
                q: input
            });

            const response = await fetch(apiUrl);

            const jsonData = await response.json();

            if (jsonData.data && jsonData.data[0] && jsonData.data[0].images && jsonData.data[0].images.length > 0) {
                const imageUrls = jsonData.data[0].images.map(image => image.url);

                const randomImageUrl = getRandomElement(imageUrls);

                await ctx.reply({
                    image: {
                        url: randomImageUrl
                    },
                    caption: `• Prompt: ${input}`
                });
            }
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}