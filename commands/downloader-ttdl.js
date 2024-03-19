const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'ttdl',
    aliases: ['tiktok', 'tt', 'vt', 'vtdl'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            const ttdl = await fg.tiktok(input);

            await ctx.reply({
                video: {
                    url: ttdl.hdplay || ttdl.play
                },
                caption: `• Nama panggilan: ${ttdl.nickname}\n` +
                    `• ID: ${ttdl.unique_id}\n` +
                    `• Durasi: ${ttdl.duration}` +
                    `• Deskripsi: ${ttdl.description}`,
                gifPlayback: false
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};