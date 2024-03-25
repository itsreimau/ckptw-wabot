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
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei ayanami`)}`
        );

        try {
            const result = await fg.googleImage(input);

            if (!result) return ctx.reply(global.msg.notFound);

            await ctx.reply({
                image: {
                    url: getRandomElement(result)
                },
                caption: `• Kueri: ${input}`
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function getRandomElement(arr) {
    if (arr.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
};