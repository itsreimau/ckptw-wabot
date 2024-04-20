const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'setname',
    category: 'group',
    code: async (ctx) => {
        const handlerMsg = handler(ctx, {
            admin: true,
            botAdmin: true,
            group: true
        });

        if (handlerMsg) return ctx.reply(handlerMsg);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion fans`)}`
        );

        try {
            await ctx._client.groupUpdateSubject(ctx.id, input);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah nama grup!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};