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
            afk.set(ctx._sender.jid, [Date.now(), input || 'tanpa alasan']);

            return ctx.reply({
                text: `Anda sekarang akan AFK dengan alasan ${input}.`,
                mentions: ctx.getMentioned()
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};