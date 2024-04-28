const {
    handler
} = require('../handler.js');
const {
    mediafiredl
} = require('@bochilteam/scraper');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const mime = require('mime-types');

module.exports = {
    name: 'mfdl',
    aliases: ['mf', 'mediafire', 'mediafiredl'],
    category: 'downloader',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://github.com/itsreimau/ckptw-wabot`)}`
        );

        try {
            const urlRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            const result = await mediafiredl(input);

            if (!result.url || !result.url2) throw new Error(global.msg.notFound);

            return ctx.reply({
                document: result.url || result.url2,
                mimetype: mime.contentType(result.ext.toLowerCase())
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};