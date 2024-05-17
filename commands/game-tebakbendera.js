const {
    tebakbendera
} = require('@bochilteam/scraper');
const {
    bold
} = require('@mengkodingan/ckptw');

const session = new Map();

module.exports = {
    name: 'tebakbendera',
    aliases: ['guessflag', 'whatflag'],
    category: 'game',
    code: async (ctx) => {
        if (session.has(ctx.id)) return ctx.reply('Sesi permainan sedang berjalan!');

        const data = await tebakbendera();
        const coin = 3;
        const timeout = 120000;

        session.set(ctx.id, true);

        ctx.reply(
            `❖ ${bold('Tebak Bendera')}\n` +
            '\n' +
            `➤ Bonus: ${coin} Koin\n` +
            `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
            'Ketik "hint" untuk bantuan.\n' +
            '\n' +
            global.msg.footer
        );

        const col = ctx.MessageCollector({
            time: timeout
        });

        col.on('collect', async (m) => {
            if (m.content.toLowerCase().trim() === data.jawaban.toLowerCase().trim()) {
                await session.delete(ctx.id);
                await global.db.add(`user.${senderNumber}.coin`, coin);
                ctx.reply(
                    `${bold('[ ! ]')} Benar!\n` +
                    `+${coin} Koin`
                );
                return col.stop();
            } else if (m.content.toLowerCase() === 'hint') {
                let clue = data.jawaban.replace(/[AIUEOaiueo]/g, '_');
                ctx.reply(clue);
            } else if (m.content.toLowerCase().endsWith(data.jawaban.split(' ')[1])) {
                ctx.reply('Sedikit lagi!');
            }
        });

        col.on('end', async (collector, r) => {
            if (session.has(ctx.id)) {
                await session.delete(ctx.id);

                return ctx.reply(
                    `Waktu habis!\n` +
                    `Jawabannya adalah ${data.jawaban}.`
                );
            }
        });
    }
};