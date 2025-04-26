const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const didYouMean = require("didyoumean");

const session = new Map();

module.exports = {
    name: "family100",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(quote("🎮 Sesi permainan sedang berjalan!"));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/refs/heads/master/games/family100.json");
            const result = tools.general.getRandomElement((await axios.get(apiUrl)).data);

            const game = {
                coin: {
                    answered: 5,
                    allAnswered: 50
                },
                timeout: 90000,
                answers: new Set(result.jawaban.map(d => d.toLowerCase())),
                participants: new Set()
            };

            session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`Soal: ${result.soal}`)}\n` +
                `${quote(`Jumlah jawaban: ${game.answers.size}`)}\n` +
                `${quote(`Batas waktu: ${tools.general.convertMsToDuration(game.timeout)}`)}\n` +
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

                if (game.answers.has(participantAnswer)) {
                    game.answers.delete(participantAnswer);
                    game.participants.add(participantId);

                    await db.add(`user.${participantId}.coin`, game.coin.answered);
                    await ctx.sendMessage(ctx.id, {
                        text: quote(`✅ ${tools.general.ucword(participantAnswer)} benar! Jawaban tersisa: ${game.answers.size}`)
                    }, {
                        quoted: m
                    });

                    if (game.answers.size === 0) {
                        session.delete(ctx.id);
                        for (const participant of game.participants) {
                            await db.add(`user.${participant}.coin`, game.coin.allAnswered);
                            await db.add(`user.${participant}.winGame`, 1);
                        }
                        await ctx.sendMessage(ctx.id, {
                            text: quote(`🎉 Selamat! Semua jawaban telah terjawab! Setiap anggota yang menjawab mendapat ${game.coin.allAnswered} koin.`)
                        }, {
                            quoted: m
                        });
                        return collector.stop();
                    }
                } else if (participantAnswer === "surrender") {
                    const remaining = [...game.answers].map(tools.general.ucword).join(", ").replace(/, ([^,]*)$/, ", dan $1");
                    session.delete(ctx.id);
                    await ctx.sendMessage(ctx.id, {
                        text: `${quote("🏳️ Anda menyerah!")}\n` +
                            quote(`Jawaban yang belum terjawab adalah ${remaining}.`)
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
                const remaining = [...game.answers].map(tools.general.ucword).join(", ").replace(/, ([^,]*)$/, ", dan $1");

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${quote("⏱ Waktu habis!")}\n` +
                        quote(`Jawaban yang belum terjawab adalah ${remaining}`)
                    );
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};