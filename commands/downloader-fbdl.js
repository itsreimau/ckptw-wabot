const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'fbdl',
    aliases: ['fb', 'facebook'],
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
                apiUrl = createAPIUrl('miwudev', '/api/v1/fbdl', {
                    url: input
                });
                const response = await fetch(apiUrl);
                const data = await response.json();
                result = data.hd || data.sd;
            } catch {
                const data = await fg.fbdl(input);
                result = data.videoUrl;
            }

            if (!result.videoUrl) return ctx.reply(global.msg.urlInvalid);

            await ctx.reply({
                video: {
                    url: result
                },
                caption: `❖ ${bold('FB Downloader')}\n` +
                    `\n` +
                    `• URL: ${input}\n` +
                    `\n` +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};