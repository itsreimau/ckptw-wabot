const {
    bold
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'fbdl',
    aliases: ['facebook', 'fb'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan URL!`);

        try {
            const fbdl = await fg.fbdl(input);

            await ctx.reply({
                video: {
                    url: fbdl.videoUrl
                },
                caption: `• Judul: ${fbdl.title}\n` +
                    `• Ukuran: ${fbdl.size}`,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};