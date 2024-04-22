const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'simsimi',
    aliases: ['simi'],
    category: 'fun',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`
        );

        try {
            const apiUrl = createAPIUrl('sandipbaruwal', '/sim', {
                chat: input,
                lang: 'id'
            });
            const response = await fetch(apiUrl);

            if (!response.status === 200) throw new Error(global.msg.notFound);

            const data = await response.json();

            return ctx.reply(data.answer);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};