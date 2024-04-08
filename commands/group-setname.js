const {
    isNotAdmin,
    isNotAdminOf,
    isPrivate
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'setname',
    category: 'group',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion fans`)}`
        );

        if (isNotAdmin(ctx)) return ctx.reply(global.msg.admin);

        if (isNotAdminOf(ctx)) return ctx.reply(global.msg.botAdmin);

        if (isPrivate(ctx)) return ctx.reply(global.msg.group);

        try {
            await ctx._client.groupUpdateSubject(ctx.id, input);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah nama grup!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};