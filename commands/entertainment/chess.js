const {
    quote
} = require("@mengkodingan/ckptw");
const {
    Chess
} = require("chess.js");

const session = new Map();

module.exports = {
    name: "chess",
    aliases: "catur",
    category: "entertainment",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const opponentJid = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!opponentJid) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        await ctx.reply({
            text: quote(`🕹️ Apakah Anda ingin bermain catur dengan @${opponentJid.replace(/@.*|:.*/g, "")}? Ketik Y untuk setuju atau N untuk menolak.`),
            mentions: [opponentJid]
        });

        let starting = false;
        const initialCollector = ctx.MessageCollector({
            time: 30000
        });

        initialCollector.on("collect", async (m = initialMessage) => {
            const response = initialMessage.content.trim().toUpperCase();
            const participantJid = initialMessage.key.participant;

            if (![senderJid, opponentJid].includes(participantJid)) return;

            if (participantJid === opponentJid) {
                if (response === "Y") {
                    starting = true;
                    await ctx.reply(quote("🎉 Permainan dimulai!"));

                    const game = new Chess();
                    session.set(ctx.id, {
                        chess: game,
                        currentTurn: "w",
                        turnTimeout: null
                    });

                    const fenUrl = global.tools.api.createUrl("https://fen2png.com", "/api/", {
                        fen: game.fen(),
                        raw: true
                    });

                    await ctx.sendMessage(ctx.id, {
                        image: {
                            url: fenUrl
                        },
                        caption: quote("Giliran Putih untuk bergerak.")
                    }, {
                        quoted: initialMessage
                    });

                    const gameCollector = ctx.MessageCollector({
                        time: 30000
                    });

                    gameCollector.on("collect", async (m = gameMessage) => {
                        const moveSenderJid = gameMessage.key.participant;
                        const move = gameMessage.content.trim().toLowerCase();
                        const gameSession = session.get(ctx.id);

                        if (![senderJid, opponentJid].includes(moveSenderJid)) return;

                        if ((gameSession.currentTurn === "w" && moveSenderJid !== senderJid) || (gameSession.currentTurn === "b" && moveSenderJid !== opponentJid)) return;

                        clearTimeout(gameSession.turnTimeout);
                        const result = game.move(move);

                        if (!result) {
                            await ctx.reply(quote("Gerakan tidak valid! Gunakan notasi standar catur (contoh: e4, Nf3)."));
                        } else {
                            gameSession.currentTurn = gameSession.currentTurn === "w" ? "b" : "w";
                            session.set(ctx.id, gameSession);

                            const nextTurn = gameSession.currentTurn === "w" ? "Putih" : "Hitam";
                            const fenUrl = global.tools.api.createUrl("https://fen2png.com", "/api/", {
                                fen: game.fen(),
                                raw: true
                            });

                            await ctx.sendMessage(ctx.id, {
                                image: {
                                    url: fenUrl
                                },
                                caption: quote(`Giliran ${nextTurn} untuk bergerak.`)
                            }, {
                                quoted: gameMessage
                            });

                            if (game.isCheckmate()) {
                                await ctx.sendMessage(ctx.id, {
                                    text: quote("🏆 Skakmat! Anda menang!")
                                }, {
                                    quoted: gameMessage
                                });
                                session.delete(ctx.id);
                                await Promise.all([
                                    await global.db.add(`user.${moveSenderJid}.coin`, 50),
                                    await global.db.add(`user.${moveSenderJid}.winGame`, 1)
                                ]);
                                return gameCollector.stop();
                            } else if (game.isDraw()) {
                                await ctx.sendMessage(ctx.id, {
                                    text: quote("Permainan berakhir dengan remis!")
                                }, {
                                    quoted: gameMessage
                                });
                                session.delete(ctx.id);
                                return gameCollector.stop();
                            } else {
                                gameSession.turnTimeout = setTimeout(async () => {
                                    await ctx.sendMessage(ctx.id, {
                                        text: quote("⏳ Waktu habis! Permainan berakhir.")
                                    }, {
                                        quoted: gameMessage
                                    });
                                    session.delete(ctx.id);
                                    return gameCollector.stop();
                                }, 60000);
                            }
                        }
                    });
                } else if (response === "N") {
                    await ctx.reply(quote("❌ Permainan dibatalkan."));
                    initialCollector.stop();
                }
            }
        });

        initialCollector.on("end", () => {
            if (!starting) return ctx.reply(quote("⏳ Waktu menunggu habis! Permainan dibatalkan."));
        });
    }
};