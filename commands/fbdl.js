const {
    bold
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');
const {
    sendStatus
} = require('../lib/simple.js');

module.exports = {
    name: 'fbdl',
    aliases: ['facebook', 'fb'],
    category: 'downloader',
    code: async (ctx) => {
        sendStatus(ctx, 'processing');

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan URL!`).then(() => sendStatus(ctx, 'noRequest'));

        try {
            const fbdl = await fg.fbdl(input);

            return ctx.reply({
                video: {
                    url: fbdl.videoUrl
                },
                caption: `• Judul: ${fbdl.title}\n` +
                    `• Ukuran: ${fbdl.size}`,
                gifPlayback: false
            }).then(() => sendStatus(ctx, 'success'));
        } catch (error) {
            console.error("Error:", error);
            await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`).then(() => sendStatus(ctx, 'failure'));
        }
    }
};