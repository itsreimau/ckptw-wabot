const {
    isAdmin,
    isAdminOf
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'setdesc',
    category: 'group',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} fuck you!`)}`
        );

        if (isAdmin(ctx, true)) return ctx.reply(global.msg.admin);

        if (isAdminOf(ctx, true)) return ctx.reply(global.msg.botAdmin);

        if (!ctx.isGroup()) return ctx.reply(global.msg.group);

        try {
            await ctx._client.groupUpdateDescription(ctx.id, input);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah deskripsi grup!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};