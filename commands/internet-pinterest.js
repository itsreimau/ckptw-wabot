const {
    pinterest
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'pinterest',
    aliases: ['pin', 'pint'],
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei ayanami`)}`
        );

        try {
            const result = await pinterest(input);

            if (!result) return ctx.reply(global.msg.notFound);

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${bold('Pinterest')}\n` +
                    `\n` +
                    `• Kueri: ${input}\n` +
                    `\n` +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};