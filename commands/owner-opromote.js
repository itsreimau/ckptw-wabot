const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'opromote',
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
            const groupJid = ctx.isGroup ? ctx._msg.key.remoteJid : null;
            const groupMetadata = ctx.isGroup ? await ctx._client.groupMetadata(groupJid) : null;
            const groupParticipant = groupMetadata ? groupMetadata.participants : null;
            const groupAdmin = groupParticipant ? groupParticipant.filter(p => p.admin !== null).map(p => p.id) : [];
            const isAdmin = ctx.isGroup ? groupAdmin.includes(senderJid) : false;

            if (isAdmin) throw new Error('Anggota ini adalah admin grup.');

            await ctx._client.groupParticipantUpdate(ctx.id, [member], 'promote');

            return ctx.reply(`${bold('[ ! ]')} Berhasil ditingkatkan dari anggota biasa menjadi admin!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};