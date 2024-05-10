const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');
const mime = require('mime-types');

module.exports = {
    name: 'ttdl',
    aliases: ['tt', 'vt', 'vtdl', 'tiktok', 'ttnowm', 'tiktokdl', 'tiktoknowm'],
    category: 'downloader',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            let result;

            const promises = [
                fetch(createAPIUrl('miwudev', '/api/v1/igdl', {
                    url: input
                })).then(response => response.json()), // Bug :v
                fg.tiktok(input)
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === 'fulfilled' && res.value) {
                    result = res.value.play || res.value.url;
                    break;
                }
            }

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                caption: `❖ ${bold('TT Downloader')}\n` +
                    '\n' +
                    `➤ URL: ${input}\n` +
                    '\n' +
                    global.msg.footer,
                gifPlayback: false,
                mimetype: mime.contentType('mp4')
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};