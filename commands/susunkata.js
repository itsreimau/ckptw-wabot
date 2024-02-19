const {
    susunkata
} = require('@bochilteam/scraper');
const similarity = require('similarity');

const session = new Map();

module.exports = {
    name: 'susunkata',
    category: 'game',
    code: async (ctx) => {
        if (session.has(ctx.id)) return ctx.reply('Sesi permainan sedang berjalan!');

        let timeout = 120000;
        let threshold = 0.72;
        let question = await susunkata();
        let col = ctx.MessageCollector({
            time: timeout
        });

        session.set(ctx.id, true);

        ctx.reply(
            `• Soal: ${question.soal}\n` +
            `• Tipe: ${question.tipe}\n` +
            '\n' +
            `Batas waktu ${(timeout / 1000).toFixed(2)} detik.`
        );

        col.on('collect', (m) => {
            if (m.content.toLowerCase().trim() === question.jawaban.toLowerCase().trim()) {
                session.delete(ctx.id);

                ctx.reply(
                    `${ctx._sender.pushName} telah berhasil menjawab!\n` +
                    `Jawabannya adalah ${question.jawaban}.`
                );
                col.stop();
            } else if (similarity(m.content.toLowerCase(), question.jawaban.toLowerCase().trim()) >= threshold) {
                if (m.content.toLowerCase().trim() !== question.jawaban.toLowerCase().trim()) {
                    ctx.reply('Sedikit lagi!');
                }
            }
        });

        col.on('end', async (collector, r) => {
            session.delete(ctx.id);

            await ctx.reply(
                `Waktu habis!\n` +
                `Jawabannya adalah ${question.jawaban}.`
            );
        });
    }
};