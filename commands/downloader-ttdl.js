const {
    handler
} = require('../handler.js');
const {
    createAPIUrl
} = require('../tools/api.js');
const {
    tiktokdl
} = require('@bochilteam/scraper');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'ttdl',
    aliases: ['tt', 'vt', 'vtdl', 'tiktok', 'ttnowm', 'tiktokdl', 'tiktoknowm'],
    category: 'downloader',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
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
                fg.tiktok(input),
                tiktokdl(input)
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === 'fulfilled') {
                    result = res.value.play || res.value.video.no_watermark_raw || res.value.video.no_watermark || res.value.video.no_watermark_hd || res.value.video.with_watermark;
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
                gifPlayback: false
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};