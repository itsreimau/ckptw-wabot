const {
    bold
} = require('@mengkodingan/ckptw');
const {
    instagram
} = require('../lib/scraper.js');

module.exports = {
    name: 'igdl',
    aliases: ['instagram', 'ig'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks URL!`);

        try {
            const igdl = await instagram(input);

            await ctx.reply({
                video: {
                    url: igdl.data[0].url
                },
                caption: `• URL: ${input}`,
                gifPlayback: false
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};