const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

const session = new Map();

module.exports = {
    name: "tebaklagu",
    category: "game",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        if (session.has(ctx.id)) return await ctx.reply(quote(`🎮 Sesi permainan sedang berjalan!`));

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/games/tebaklagu");
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const game = {
                coin: 5,
                timeout: 60000,
                senderId: ctx.sender.jid.split(/[:@]/)[0],
                answer: data.judul.toUpperCase()
            };

            session.set(ctx.id, true);

            await ctx.reply({
                audio: {
                    url: data.lagu
                },
                mimetype: mime.lookup("mp3")
            });
            await ctx.reply(
                `${quote(`Artis: ${data.artis}`)}\n` +
                `${quote(`Bonus: ${game.coin} Koin`)}\n` +
                `${quote(`Batas waktu: ${game.timeout / 1000} detik`)}\n` +
                `${quote("Ketik 'hint' untuk bantuan.")}\n` +
                `${quote("Ketik 'surrender' untuk menyerah.")}\n` +
                "\n" +
                config.msg.footer)

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toUpperCase();

                if (userAnswer === game.answer) {
                    session.delete(ctx.id);
                    await Promise.all([
                        await db.add(`user.${game.senderId}.game.coin`, game.coin),
                        await db.add(`user.${game.senderId}.winGame`, 1)
                    ]);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: `${quote("💯 Benar!")}\n` +
                                quote(`+${game.coin} Koin`)
                        }, {
                            quoted: m
                        }
                    );
                    return collector.stop();
                } else if (userAnswer === "HINT") {
                    const clue = game.answer.replace(/[AIUEO]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: monospace(clue)
                    }, {
                        quoted: m
                    });
                } else if (userAnswer === "SURRENDER") {
                    session.delete(ctx.id);
                    await ctx.reply(
                        `${quote("🏳️ Anda menyerah!")}\n` +
                        quote(`Jawabannya adalah ${game.answer}.`)
                    );
                    return collector.stop();
                }
            });

            collector.on("end", async () => {
                const artist = data.artis;

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${quote("⏱ Waktu habis!")}\n` +
                        quote(`Jawabannya adalah ${game.answer} oleh ${artist}.`)
                    );
                }
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};