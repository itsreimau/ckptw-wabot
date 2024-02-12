const {
    bold
} = require('@mengkodingan/ckptw');
const {
    instagram
} = require('../lib/scraper.js');
const {
    sendStatus
} = require('../lib/simple.js');

module.exports = {
    name: 'igdl',
    aliases: ['instagram', 'ig'],
    category: 'downloader',
    code: async (ctx) => {
        sendStatus(ctx, 'processing');

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan URL!`).then(() => sendStatus(ctx, 'noRequest'));

        try {
            const igdl = await instagram(input);

            return ctx.reply({
                video: {
                    url: igdl.data[0].url
                },
                caption: `• URL: ${input}`,
                gifPlayback: false
            }).then(() => sendStatus(ctx, 'success'));
        } catch (error) {
            console.error("Error:", error);
            await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`).then(() => sendStatus(ctx, 'failure'));
        }
    }
};