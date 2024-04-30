const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'ban',
    aliases: ['banuser'],
    category: 'owner',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const inputUser = `${input}@s.whatsapp.net`;
        const user = mentionedJids[0] || inputUser || null;

        if (!user) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${ctx._client.user.id.split(':')[0]}`)}`,
            mentions: ctx.getMentioned()
        });

        try {
            if (user === ctx._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            await global.db.set(`user.${user.split('@')[0]}.isBanned`, true);

            ctx.sendMessage(user, {
                text: 'Anda telah dibanned oleh Owner!'
            });
            ctx.reply(`${bold('[ ! ]')} Berhasil dibanned!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};