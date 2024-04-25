const {
    handler
} = require('../handler.js');
const {
    isAdmin
} = require('../lib/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'demote',
    category: 'group',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            admin: true,
            banned: true,
            botadmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const member = mentionedJids[0] || null;

        if (!member) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${ctx._client.member.id.split(':')[0]}`)}`,
            mentions: ctx.getMentioned()
        });

        try {
            if (member === ctx._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            if (await isAdmin(ctx, member.split('@')[0]) === 0) throw new Error('Anggota ini adalah anggota biasa.');

            await ctx._client.groupParticipantsUpdate(ctx.id, [member], 'demote');

            return ctx.reply(`${bold('[ ! ]')} Berhasil diturunkan dari admin menjadi anggota biasa!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};