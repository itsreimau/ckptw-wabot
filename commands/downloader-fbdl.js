const {
    facebookdl,
    facebookdlv2
} = require('@bochilteam/scraper');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const getFBInfo = require('@xaviabot/fb-downloader');
const fg = require('api-dylux');

module.exports = {
    name: 'fbdl',
    aliases: ['fb', 'facebook'],
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
                getFBInfo(input),
                fg.fbdl(input),
                facebookdl(input),
                facebookdlv2(input)
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === 'fulfilled') {
                    result = res.value.hd || res.value.sd || res.value.videoUrl || res.value.url;
                    break;
                }
            }

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                caption: `❖ ${bold('FB Downloader')}\n` +
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