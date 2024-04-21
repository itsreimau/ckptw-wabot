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

            return ctx.reply(`${ctx._sender.pushName} saat ini akan AFK: ${input || 'Tanpa alasan'}`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};