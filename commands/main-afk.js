const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'afk',
    category: 'main',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        try {
            global.db.set(`user.${ctx._sender.jid.split('@')[0]}.afk`, {
                timeStamp: Date.now(),
                reason: input || 'tanpa alasan'
            });

            return ctx.reply(`Anda sekarang akan AFK dengan alasan ${input || 'tanpa alasan'}.`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};