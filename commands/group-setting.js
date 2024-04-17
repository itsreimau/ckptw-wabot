const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'group',
    category: 'group',
    code: async (ctx) => {
        const handlerMsg = handler(ctx, {
            admin: true,
            botAdmin: true,
            group: true,
            owner: true
        });

        if (handlerMsg) return ctx.reply(handlerMsg);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument} Argumen yang tersedia adalah open dan close.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} close`)}`
        );

        try {
            const isClose = {
                'open': false,
                'close': true
            } [(input || '')]

            if (isClose === undefined) return ctx.reply(`${bold('[ ! ]')} Argumen yang tersedia adalah open dan close.`);

            await ctx._client.groupSettingUpdate(ctx.id, isClose);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah setelan grup!`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};