const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');

module.exports = {
    name: 'asmaulhusna',
    category: 'islamic',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7`)}`
        );

        try {
            const apiUrl = createAPIUrl('https://raw.githubusercontent.com', `/ZeroChanBot/Api-Freee/master/data/AsmaulHusna.json`, {});
            const response = await axios.get(apiUrl);

            const isResponseOk = (status) => status >= 200 && status < 300;
            if (!isResponseOk(response.status)) throw new Error(global.msg.notFound);

            const data = await response.data;
            const asmaulhusna = data.result;

            if (input.toLowerCase() === 'all') {
                const resultText = asmaulhusna.map((r) =>
                    `➤ Nomor: ${r.number}\n` +
                    `➤ Latin: ${r.latin}\n` +
                    `➤ Arab: ${r.arab}\n` +
                    `➤ Arti: ${r.translate_id}`
                ).join('\n-----\n');

                return ctx.reply(
                    `❖ ${bold('Asmaul Husna')}\n` +
                    '\n' +
                    `Daftar semua Asmaul Husna:\n` +
                    `${resultText}\n` +
                    '\n' +
                    global.msg.footer
                );
            }

            const index = parseInt(input);

            if (isNaN(index) || index < 1 || index > 99) throw new Error('Nomor Asmaul Husna tidak valid. Harap masukkan nomor antara 1 dan 99 atau ketik "all" untuk melihat semua Asmaul Husna.');

            const selectedName = asmaulhusna.find((r) => parseInt(r.number) === index);

            if (selectedName) {
                const {
                    latin,
                    arab,
                    translate_id
                } = selectedName;

                return ctx.reply(
                    `❖ ${bold('Asmaul Husna')}\n` +
                    '\n' +
                    `➤ Nomor: ${index}\n` +
                    `➤ Latin: ${latin}\n` +
                    `➤ Arab: ${arab}\n` +
                    `➤ Arti: ${translate_id}\n` +
                    '\n' +
                    global.msg.footer
                );
            }
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};