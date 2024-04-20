const {
    asmaulhusna
} = require('../data/asmaulhusna.json');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'asmaulhusna',
    category: 'islamic',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7`)}`
        );

        if (input.toLowerCase() === 'all') {
            const data = asmaulhusna.map((v) =>
                `➤ Nomor: ${v.urutan}\n` +
                `➤ Latin: ${v.latin}\n` +
                `➤ Arab: ${v.arab}\n` +
                `➤ Arti: ${v.arti}`
            ).join('\n-----\n');
            return ctx.reply(
                `❖ ${bold('Asmaul Husna')}\n` +
                `\n` +
                `Daftar semua Asmaul Husna:\n` +
                `${data}\n` +
                `\n` +
                global.msg.footer
            );
        }

        const index = parseInt(input);
        if (isNaN(index) || index < 1 || index > 99) return ctx.reply(`${textStyler.bold('[ ! ]')} Nomor Asmaul Husna tidak valid. Harap masukkan nomor antara 1 dan 99 atau ketik "all" untuk melihat semua Asmaul Husna.`);

        const selectedName = asmaulhusna.find((v) => v.urutan === index);
        if (selectedName) {
            const {
                latin,
                arab,
                arti
            } = selectedName;
            return ctx.reply(
                `❖ ${bold('Asmaul Husna')}\n` +
                `\n` +
                `➤ Nomor: ${index}\n` +
                `➤ Latin: ${latin}\n` +
                `➤ Arab: ${arab}\n` +
                `➤ Arti: ${arti}\n` +
                `\n` +
                global.msg.footer

            );
        } else {
            return ctx.reply(global.msg.notFound);
        }
    }
}