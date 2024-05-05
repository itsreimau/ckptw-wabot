const {
    getRandomElement
} = require('../tools/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'googleimage',
    aliases: ['gimage'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei ayanami`)}`
        );

        try {
            const result = await fg.googleImage(input);

            if (!result) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: getRandomElement(result)
                },
                caption: `❖ ${bold('Google Image')}\n` +
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