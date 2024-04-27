const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    jadwalsholat
} = require('@bochilteam/scraper')

module.exports = {
    name: 'jadwalsholat',
    aliases: ['sholat'],
    category: 'islamic',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`
        );

        try {
            const result = await jadwalsholat(input);

            if (!result) throw new Error(global.msg.notFound);

            const resultText = Object.entries(result.today).map(([name, data])
                `➤ ${name}: ${data}`
            ).join('\n');
            return ctx.reply(
                `❖ ${bold('Jadwal Sholat')}\n` +
                '\n' +
                `➤ Wilayah: ${input}\n` +
                '-----\n' +
                `${resultText}\n` +
                '\n' +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};