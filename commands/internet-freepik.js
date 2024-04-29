const {
    handler
} = require('../handler.js');
const {
    freepik
} = require('../tools/scraper.js');
const {
    getRandomElement
} = require('../tools/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'freepik',
    category: 'internet',
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
            const result = await freepik(input);

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: getRandomElement(result)
                },
                caption: `❖ ${bold('Freepik')}\n` +
                    '\n' +
                    `➤ Kueri: ${input}\n` +
                    '\n' +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};