const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    afk
} = require('discord-afk-js');

module.exports = {
    name: 'afk',
    category: 'main',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        try {
            afk.set(ctx._sender.jid, [Date.now(), input || 'Tanpa alasan']);

            return ctx.reply({
                text: `${ctx._sender.jid.split('@')[0]} sekarang afk!\n` +
                    `Alasan: ${input || 'Tanpa alasan'}`,
                mentions: ctx.getMentioned()
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};