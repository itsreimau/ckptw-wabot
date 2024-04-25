const {
    handler
} = require('../handler.js');
const {
    seaart
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'seaart',
    category: 'ai',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const result = await seaart(input);

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: result.banner.url
                },
                caption: `❖ ${bold('SeaArt')}\n` +
                    '\n' +
                    `➤ Prompt: ${result.prompt}\n` +
                    `➤ Model ID: ${result.model_id}\n` +
                    `➤ Author: ${result.author.name}\n` +
                    '\n' +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};