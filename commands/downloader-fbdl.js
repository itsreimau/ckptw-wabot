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
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            const result = await fg.fbdl(input);

            if (!result.videoUrl) throw new Error(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result.videoUrl
                },
                caption: `❖ ${bold('FB Downloader')}\n` +
                    `\n` +
                    `➤ URL: ${input}\n` +
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