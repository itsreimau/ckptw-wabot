const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

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
            const apiUrl = createAPIUrl('miwudev', `/api/v1/igdl`, {
                url: input
            }); // Miru mengatakan Instagram API dapat mengunduh video lain seperti TikTok, Twitter, dll.
            const response = await fetch(apiUrl);
            const data = await response.json();

            await ctx.reply({
                video: {
                    url: data.url
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