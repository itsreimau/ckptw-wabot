const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'setdesc',
    category: 'group',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} fuck you!`)}`
        );

        try {
            await ctx._client.groupUpdateDescription(ctx.id, input);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah deskripsi grup!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};