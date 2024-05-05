const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'translate',
    aliases: ['tr'],
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo dunia!`)}`
        );

        try {
            let lang = 'id';
            let inp = ctx._args;

            if (ctx._args.length > 2) {
                lang = ctx._args[0];
                inp = ctx._args.slice(1);
            }

            const result = await translate(inp.join(' '), null, lang);

            return await ctx.reply(result.translation);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};