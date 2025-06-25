const axios = require("axios");
const didYouMean = require("didyoumean");

const session = new Map();

module.exports = {
    name: "tebakkalimat",
    category: "game",
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(formatter.quote("🎮 Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/refs/heads/master/games/tebakkalimat.json");
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: 10,
                timeout: 60000,
                answer: result.jawaban.toLowerCase().trim()
            };

            session.set(ctx.id, true);

            await ctx.reply(
                `${formatter.quote(`Soal: ${result.soal}`)}\n` +
                `${formatter.quote(`Bonus: ${game.coin} Koin`)}\n` +
                `${formatter.quote(`Batas waktu: ${tools.msg.convertMsToDuration(game.timeout)}`)}\n` +
                `${formatter.quote(`Ketik ${formatter.monospace("hint")} untuk bantuan.`)}\n` +
                `${formatter.quote(`Ketik ${formatter.monospace("surrender")} untuk menyerah.`)}\n` +
                "\n" +
                config.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantId = ctx.getId(m.sender);

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    await db.add(`user.${participantId}.coin`, game.coin);
                    await db.add(`user.${participantId}.winGame`, 1);
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("💯 Benar!")}\n` +
                            formatter.quote(`+${game.coin} Koin`)
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (["h", "hint"].includes(participantAnswer)) {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                } else if (["s", "surrender"].includes(participantAnswer)) {
                    session.delete(ctx.id);
                    await ctx.sendMessage(ctx.id, {
                        text: `${formatter.quote("🏳️ Kamu menyerah!")}\n` +
                            formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await ctx.sendMessage(ctx.id, {
                        text: formatter.quote("🎯 Sedikit lagi!")
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${formatter.quote("⏱ Waktu habis!")}\n` +
                        formatter.quote(`Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)
                    );
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};