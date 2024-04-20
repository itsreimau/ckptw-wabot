const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'dalle',
    aliases: ['dall'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const apiUrl = createAPIUrl('aemt', `/dalle`, {
                text: input
            });
            const response = await fetch(apiUrl);

            if (response.status === 400) new Error(global.msg.notFound);

            await ctx.reply({
                image: response.buffer(),
                caption: `❖ ${bold('DALL·E')}\n` +
                    `\n` +
                    `• Prompt: ${input}\n` +
                    `\n` +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};