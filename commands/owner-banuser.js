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
    category: 'group',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const inputUser = `${input}@s.whatsapp.net`;
        const user = mentionedJids[0] || (ctx._args[0] ? (ctx._args.join('').replace(/[@ .+-]/g, '').replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : null);

        if (!user) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${ctx._client.user.id.split(':')[0]}`)}`,
            mentions: ctx.getMentioned()
        });

        try {
            if (user === ctx._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            if (!global.db.get(user)) throw new Error('Pengguna tidak ada di database!');

            await global.db.set(`${user}.isBanned`, true);

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