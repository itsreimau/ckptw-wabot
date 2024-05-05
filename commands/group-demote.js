const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'demote',
    category: 'group',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const member = mentionedJids[0] || null;

        if (!member.length) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${ctx._client.member.id.split(':')[0]}`)}`,
            mentions: ctx.getMentioned()
        });

        try {
            const senderJid = ctx._sender.jid;
            const groupJid = ctx.isGroup ? m.key.remoteJid : null;
            const groupMetadata = ctx.isGroup ? await ctx._client.groupMetadata(groupJid) : null;
            const groupParticipant = groupMetadata ? groupMetadata.participants : null;
            const groupAdmin = groupParticipant ? groupParticipant.filter(p => p.admin !== null).map(p => p.id) : [];
            const isAdmin = ctx.isGroup ? groupAdmin.includes(senderJid) : false;

            if (member === ctx._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            if (isAdmin) throw new Error('Anggota ini adalah anggota biasa.');

            await ctx._client.groupParticipantUpdate(ctx.id, [member], 'demote');

            return ctx.reply(`${bold('[ ! ]')} Berhasil diturunkan dari admin menjadi anggota biasa!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};