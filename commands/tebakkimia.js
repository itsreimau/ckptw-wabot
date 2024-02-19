const {
    tebakkimia
} = require('@bochilteam/scraper');
const similarity = require('similarity');

const session = new Map();

module.exports = {
    name: 'tebakkimia',
    aliases: ['guesschemistry', 'whatchemistry'],
    category: 'game',
    code: async (ctx) => {
        if (session.has(ctx.id)) return ctx.reply('Sesi permainan sedang berjalan!');

        let timeout = 120000;
        let threshold = 0.72;
        let question = await tebakkimia();
        let col = ctx.MessageCollector({
            time: timeout
        });

        session.set(ctx.id, true);

        ctx.reply(
            `• Lambang: ${question.lambang}\n` +
            '\n' +
            `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
            `Ketik 'hint' untuk bantuan.`
        );

        col.on('collect', (m) => {
            if (m.content.toLowerCase().trim() === question.unsur.toLowerCase().trim()) {
                session.delete(ctx.id);

                ctx.reply(
                    `${ctx._sender.pushName} telah berhasil menjawab!\n` +
                    `Jawabannya adalah ${question.unsur}.`
                );
                col.stop();
            } else if (m.content.toLowerCase() === 'hint') {
                let clue = question.unsur.replace(/[AIUEOaiueo]/g, '_');
                ctx.reply(clue);
            } else if (similarity(m.content.toLowerCase(), question.unsur.toLowerCase().trim()) >= threshold) {
                if (m.content.toLowerCase().trim() !== question.unsur.toLowerCase().trim()) {
                    ctx.reply('Sedikit lagi!');
                }
            }
        });

        col.on('end', async (collector, r) => {
            session.delete(ctx.id);

            await ctx.reply(
                `Waktu habis!\n` +
                `Jawabannya adalah ${question.unsur}.`
            );
        });
    }
};