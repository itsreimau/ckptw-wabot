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
        const collector = ctx.MessageCollector({
            time: 30000
        });

        collector.on("collect", async (m) => {
            const response = m.content.trim().toUpperCase();
            const participantJid = m.key.participant;

            if (![senderJid, opponentJid].includes(participantJid)) return;

            if (participantJid === opponentJid) {
                if (response === "Y") {
                    starting = true;
                    await ctx.reply(quote("🎉 Permainan dimulai!"));

                    const game = new Chess();
                    const gameSession = {
                        chess: game,
                        currentTurn: "w",
                        turnTimeout: null
                    };
                    session.set(ctx.id, gameSession);

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
                        quoted: m
                    });

                    ctx.MessageCollector({
                        time: 30000
                    }).on("collect", async (moveMessage) => {
                        const moveSenderJid = moveMessage.key.participant;
                        const move = moveMessage.content.trim().toLowerCase();

                        if (![senderJid, opponentJid].includes(moveSenderJid)) return;

                        if ((gameSession.currentTurn === "w" && moveSenderJid !== senderJid) ||
                            (gameSession.currentTurn === "b" && moveSenderJid !== opponentJid)) {
                            return;
                        }

                        clearTimeout(gameSession.turnTimeout);
                        const result = game.move(move);

                        if (!result) {
                            await ctx.reply(quote("Gerakan tidak valid! Gunakan notasi standar catur (contoh: e4, Nf3)."));
                        } else {
                            gameSession.currentTurn = gameSession.currentTurn === "w" ? "b" : "w";
                            session.set(ctx.id, gameSession);

                            if (game.isCheckmate()) {
                                await ctx.sendMessage(ctx.id, {
                                    text: quote("🏆 Skakmat! Anda menang!")
                                }, {
                                    quoted: moveMessage
                                });

                                await global.db.add(`user.${moveSenderJid}.coin`, 50);
                                await global.db.add(`user.${moveSenderJid}.winGame`, 1);

                                session.delete(ctx.id);
                            } else if (game.isDraw()) {
                                await ctx.sendMessage(ctx.id, {
                                    text: quote("Permainan berakhir dengan remis!")
                                }, {
                                    quoted: moveMessage
                                });
                                session.delete(ctx.id);
                            } else {
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
                                    quoted: moveMessage
                                });

                                gameSession.turnTimeout = setTimeout(async () => {
                                    session.delete(ctx.id);
                                    await ctx.sendMessage(ctx.id, {
                                        text: quote("⏳ Waktu habis! Permainan berakhir.")
                                    }, {
                                        quoted: moveMessage
                                    });
                                }, 60000);
                            }
                        }
                    });
                } else if (response === "N") {
                    await ctx.reply(quote("❌ Permainan dibatalkan."));
                    collector.stop();
                }
            }
        });

        collector.on("end", () => {
            if (!starting) return ctx.reply(quote("⏳ Waktu menunggu habis! Permainan dibatalkan."));
        });
    }
};