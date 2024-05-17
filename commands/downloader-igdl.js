const {
    createAPIUrl
} = require('../tools/api.js');
const {
    instagramdl,
} = require('@bochilteam/scraper');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const mime = require('mime-types');

module.exports = {
    name: 'igdl',
    aliases: ['ig', 'instagram'],
    category: 'downloader',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
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
                })).then(response => response.data),
                instagramdl(input)
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === 'fulfilled' && res.value) {
                    result = res.value.result || res.value.url;
                    break;
                }
            }

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.contentType('mp4'),
                caption: `❖ ${bold('IG Downloader')}\n` +
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