const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'igdl',
    aliases: ['ig', 'instagram'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            let apiUrl;
            let result;

            try {
                apiUrl = createAPIUrl('miwudev', '/api/v1/igdl', {
                    url: input
                });
                const response = await fetch(apiUrl);
                const data = await response.json();
                result = data.result;
            } catch {
                const data = await fg.igdl(input);
                result = data.url;
            }

            if (!result) return ctx.reply(global.msg.urlInvalid);

            await ctx.reply({
                video: {
                    url: result
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