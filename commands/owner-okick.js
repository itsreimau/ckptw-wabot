const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'okick',
    category: 'owner',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            botAdmin: true,
            group: true,
            owner: true
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
            const groupMetadata = ctx.isGroup ? await ctx._client.groupMetadata(groupJid) : null;
            const groupParticipant = groupMetadata ? groupMetadata.participants : null;
            const groupAdmin = groupParticipant ? groupParticipant.filter(p => p.admin !== null).map(p => p.id) : [];
            const isAdmin = ctx.isGroup ? groupAdmin.includes(senderJid) : false;

            if (member === ctx._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            if (isAdmin) throw new Error('Anggota ini adalah admin grup.');

            await ctx._client.groupParticipantUpdate(ctx.id, [member], 'remove');

            return ctx.reply(`${bold('[ ! ]')} Berhasil dikeluarkan!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};