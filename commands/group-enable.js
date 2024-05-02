const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'enable',
    aliases: ['on', 'enabled'],
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

        if (ctx._args[0] === 'list') {
            const listText = fs.readFileSync(path.resolve(__dirname, '../assets/txt/list-enable_disable.txt'), 'utf8');

            return ctx.reply(
                `❖ ${bold('Daftar')}\n` +
                '\n' +
                `${listText}\n` +
                '\n' +
                global.msg.footer
            );
        }

        try {
            if (input.toLowerCase() === 'antilink') {
                await global.db.set(`group.${ctx.id.split('@')[0]}.antilink`, true);
                return ctx.reply(`${bold('[ ! ]')} Berhasil diaktifkan!`);
            }

            if (input.toLowerCase() === 'welcome') {
                await global.db.set(`group.${ctx.id.split('@')[0]}.welcome`, true);
                return ctx.reply(`${bold('[ ! ]')} Berhasil diaktifkan!`);
            }
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};