const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'disable',
    aliases: ['off', 'disable'],
    category: 'owner',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            admin: true,
            banned: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} welcome`)}`
        );

        try {
            if (input === 'antilink') {
                await global.db.set(`group.${ctx.id.split('@')[0]}.antilink`, false);
                return ctx.reply(`${bold('[ ! ]')} Berhasil dinonaktifkan!`);
            }

            if (input === 'welcome') {
                await global.db.set(`group.${ctx.id.split('@')[0]}.welcome`, false);
                return ctx.reply(`${bold('[ ! ]')} Berhasil dinonaktifkan!`);
            }
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};