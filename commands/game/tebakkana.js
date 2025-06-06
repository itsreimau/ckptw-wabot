const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const didYouMean = require("didyoumean");

const session = new Map();

module.exports = {
    name: "tebakkana",
    category: "game",
    permissions: {},
    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(quote("🎮 Sesi permainan sedang berjalan!"));

        const level = parseInt(ctx.args[0], 10) || null;

        if (!level) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "1"))}\n` +
            quote(tools.cmd.generateNotes(["Selain 1, bisa 2, 3, 4, dan 5."]))
        );

        try {
            const limit = {
                1: 3463,
                2: 1831,
                3: 1797,
                4: 632,
                5: 662
            } [level];
            const apiUrl = tools.api.createUrl("https://jlpt-vocab-api.vercel.app", "/api/words", {
                level,
                limit
            });
            const result = tools.general.getRandomElement((await axios.get(apiUrl)).data.words);

            let question, answer, clue;
            if (Math.random() < 0.5) {
                question = `Apa bentuk romaji dari "${result.furigana || result.word}"?`;
                answer = result.romaji;
                clue = answer.replace(/[aiueo]/g, "_").toLowerCase();
            } else {
                question = `Tuliskan kana untuk romaji "${result.romaji}"`;
                answer = result.furigana || result.word;
                clue = answer.replace(/[あいうえおアイウエオ]/g, "_");
            }

            const game = {
                coin: 5,
                timeout: 60000,
                answer: result.jawaban.toLowerCase(),
                description: ctx.sender.jid.startsWith("62") ? await tools.general.translate(result.meaning, "id") : result.meaning
            };

            session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`Soal: ${question}`)}\n` +
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
                    await ctx.sendMessage(ctx.id, {
                        text: `${quote("💯 Benar!")}\n` +
                            `${quote(game.description)}\n` +
                            quote(`+${game.coin} Koin`)
                    }, {
                        quoted: m
                    });
                    return collector.stop();
                } else if (["h", "hint"].includes(participantAnswer)) {
                    await ctx.sendMessage(ctx.id, {
                        text: monospace(clue)
                    }, {
                        quoted: m
                    });
                } else if (["s", "surrender"].includes(participantAnswer)) {
                    session.delete(ctx.id);
                    await ctx.sendMessage(ctx.id, {
                        text: `${quote("🏳️ Anda menyerah!")}\n` +
                            `${quote(`Jawabannya adalah ${tools.general.ucwords(game.answer)}.`)}\n` +
                            quote(game.description)
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
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${quote("⏱ Waktu habis!")}\n` +
                        `${quote(`Jawabannya adalah ${tools.general.ucwords(game.answer)}.`)}\n` +
                        quote(game.description)
                    );
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};