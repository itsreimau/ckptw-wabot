const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'ttdl',
    aliases: ['tt', 'vt', 'vtdl', 'tiktok'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            const result = await fg.tiktok(input);

            if (!result.hdplay || !result.play) return ctx.reply(global.msg.urlInvalid);

            await ctx.reply({
                video: {
                    url: result.hdplay || result.play
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