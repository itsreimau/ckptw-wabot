const {
    handler
} = require('../handler.js');
const {
    wikipedia
} = require('@bochilteam/scraper');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'wikipedia',
    aliases: ['wiki'],
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const result = await wikipedia(input);

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: result.img
                },
                caption: `❖ ${bold('Wikipedia')}\n` +
                    '\n' +
                    `➤ ${result.title}\n` +
                    '-----\n' +
                    `${result.articles}\n` +
                    '\n' +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};