const {
    siapakahaku
} = require('@bochilteam/scraper');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'siapakahaku',
    aliases: ['whoami'],
    category: 'game',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        const roomNumber = ctx.id.split('@')[0];

        const fetchStatus = await db.fetch(`game.siapakahaku.${roomNumber}.status`);
        if (fetchStatus) return ctx.reply('Masih ada pertanyaan yang belum terjawab di chat ini.');

        const data = await siapakahaku();
        await global.db.set(`game.siapakahaku.${roomNumber}`, {
            status: true,
            timeout: 120000,
            question: data.soal,
            answer: data.jawaban,
            coin: 3
        });

        const fetchQuestion = await global.db.fetch(`game.siapakahaku.${roomNumber}.question`);
        const fetchTimeout = await global.db.fetch(`game.siapakahaku.${roomNumber}.timeout`);
        const fetchAnswer = await global.db.fetch(`game.siapakahaku.${roomNumber}.answer`);
        const fetchCoin = await global.db.fetch(`game.siapakahaku.${roomNumber}.coin`);

        ctx.reply(
            `❖ ${bold('Siapakah Aku')}\n` +
            '\n' +
            `➤ Soal: ${fetchQuestion}\n` +
            `➤ Bonus: ${fetchCoin} Koin\n` +
            `Batas waktu ${(fetchTimeout / 1000).toFixed(2)} detik.\n` +
            'Ketik "who" untuk bantuan.\n' +
            '\n' +
            global.msg.footer
        );

        const col = ctx.MessageCollector({
            time: 120000
        });

        col.on('collect', async (m) => {
            if (m.content.toLowerCase() === fetchAnswer.toLowerCase()) {
                await ctx.reply(
                    `${bold('[ ! ]')} Benar!\n` +
                    `+${fetchCoin} Koin`
                );
                await global.db.delete(`game.siapakahaku.${roomNumber}`);
                return col.stop();
            } else if (m.content.toLowerCase() === 'who') {
                const clue = fetchAnswer.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_');
                await ctx.reply(clue);
            } else if (m.content.toLowerCase().endsWith(fetchAnswer.split(' ')[1])) {
                await ctx.reply('Sedikit lagi!');
            }
        });

        col.on('end', async () => {
            const fetchStatus = await global.db.fetch(`game.siapakahaku.${roomNumber}.status`);
            if (fetchStatus) {
                await ctx.reply(
                    `${bold('[ ! ]')} Waktunya habis!\n` +
                    `Jawabannya adalah ${fetchAnswer}`
                );
                return await global.db.delete(`game.siapakahaku.${roomNumber}`);
            }
        });
    }
};