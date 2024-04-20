const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'chatgpt',
    aliases: ['ai', 'chatai', 'gpt', 'gpt2'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
        );

        try {
            const apiUrl = createAPIUrl('sandipbaruwal', '/gpt2', {
                prompt: input,
                uid: ctx._sender.jid.replace('@s.whatsapp.net', '')
            });
            const response = await fetch(apiUrl);

            if (response.status === 400) new Error(global.msg.notFound);

            const data = await response.text();

            return ctx.reply(data);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};