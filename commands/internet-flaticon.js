const {
    handler
} = require('../handler.js');
const {
    flaticon
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'flaticon',
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
            const result = await flaticon(input);

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: getRandomElement(result)
                },
                caption: `❖ ${bold('Flaticon')}\n` +
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

function getRandomElement(arr) {
    if (arr.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}