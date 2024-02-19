const {
    tebakbendera
} = require('@bochilteam/scraper');
const similarity = require('similarity');

const session = new Map();

module.exports = {
    name: 'tebakbendera',
    aliases: ['guessflag', 'whatflag'],
    category: 'game',
    code: async (ctx) => {
        if (session.has(ctx.id)) return ctx.reply('Sesi permainan sedang berjalan!');

        let timeout = 120000;
        let threshold = 0.72;
        let question = await tebakbendera();
        let col = ctx.MessageCollector({
            time: timeout
        });

        session.set(ctx.id, true);

        ctx.reply({
            image: {
                url: question.img
            },
            caption: `• Negara di Dunia\n` +
                '\n' +
                `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
                `Ketik 'hint' untuk bantuan.`
        });

        col.on("collect", (m) => {
            if (m.content.toLowerCase().trim() === question.name.toLowerCase().trim()) {
                session.delete(ctx.id);

                ctx.reply(
                    `${ctx._sender.pushName} telah berhasil menjawab!\n` +
                    `Jawabannya adalah ${question.name} (${question.flag}).`
                );
                col.stop();
            } else if (m.content.toLowerCase() === 'hint') {
                let clue = question.name.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_');
                ctx.reply(clue);
            } else if (similarity(m.content.toLowerCase(), question.name.toLowerCase().trim()) >= threshold) {
                if (m.content.toLowerCase().trim() !== question.name.toLowerCase().trim()) {
                    ctx.reply('Sedikit lagi!');
                }
            }
        });

        col.on('end', async (collector, r) => {
            session.delete(ctx.id);

            await ctx.reply(
                `Waktu habis!\n` +
                `Jawabannya adalah ${question.name} (${question.flag}).`
            );
        });
    }
};