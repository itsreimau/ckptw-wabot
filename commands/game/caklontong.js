const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const didYouMean = require("didyoumean");

const session = new Map();

module.exports = {
    name: "caklontong",
    category: "game",
    permissions: {},
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(quote("🎮 Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/refs/heads/master/games/caklontong.json");
            const result = tools.general.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: 5,
                timeout: 60000,
                answer: result.jawaban.toLowerCase()
            };

            session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`Soal: ${result.soal}`)}\n` +
                `${quote(`Bonus: ${game.coin} Koin`)}\n` +
                `${quote(`Batas waktu: ${tools.general.convertMsToDuration(game.timeout)}`)}\n` +
                `${quote(`Ketik ${monospace("hint")} untuk bantuan.`)}\n` +
                `${quote(`Ketik ${monospace("surrender")} untuk menyerah.`)}\n` +
                "\n" +
                config.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantId = tools.general.getID(m.sender);

                if (participantAnswer === game.answer) {
                    session.delete(ctx.id);
                    await db.add(`user.${participantId}.coin`, game.coin);
                    await db.add(`user.${participantId}.winGame`, 1);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: `${quote("💯 Benar!")}\n` +
                                `${quote(result.deskripsi)}\n` +
                                quote(`+${game.coin} Koin`)
                        }, {
                            quoted: m
                        }
                    );
                    return collector.stop();
                } else if (participantAnswer === "hint") {
                    const clue = game.answer.replace(/[aiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                } else if (participantAnswer === "surrender") {
                    const description = result.deskripsi;
                    session.delete(ctx.id);
                    await ctx.sendMessage(ctx.id, {
                        text: `${quote("🏳️ Anda menyerah!")}\n` +
                            `${quote(`Jawabannya adalah ${tools.general.ucword(game.answer)}.`)}\n` +
                            quote(description)
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (didYouMean(participantAnswer, [game.answer]) === game.answer) {
                    await ctx.sendMessage(ctx.id, {
                        text: quote("🎯 Sedikit lagi!")
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async () => {
                const description = result.deskripsi;

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${quote("⏱ Waktu habis!")}\n` +
                        `${quote(`Jawabannya adalah ${tools.general.ucword(game.answer)}.`)}\n` +
                        quote(description)
                    );
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};