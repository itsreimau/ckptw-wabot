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
    name: 'promote',
    category: 'group',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            admin: true,
            botAdmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const mentionedJids = ctx._msg.message.extendedTextMessage.contextInfo.mentionedJid;
        const member = mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!member) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${ctx._client.member.id.split(':')[0]}`)}`,
            mentions: ctx.getMentioned()
        });

        try {
            if (await isAdmin(ctx, member.split('@')[0]) === 1) throw new Error('Anggota ini adalah admin grup.');

            await ctx._client.groupParticipantsUpdate(ctx.id, [member], 'promote');

            return ctx.reply(`${bold('[ ! ]')} Berhasil ditingkatkan dari anggota biasa menjadi admin!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};