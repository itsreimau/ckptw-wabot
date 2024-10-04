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

        await ctx.reply(
            quote(`🕹️ Apakah Anda ingin bermain catur dengan @${opponentJid.replace(/@.*|:.*/g, "")}? Ketik Y untuk setuju atau N untuk menolak.`), {
                mentions: [opponentJid]
            }
        );

        const collector = ctx.MessageCollector({
            time: 30000 // 30 detik.
        });

        collector.on("collect", async (m) => {
            const response = m.content.trim().toUpperCase();
            const participantJid = m.key.participant;

            if (participantJid !== senderJid && participantJid !== opponentJid) return;

            if (participantJid === opponentJid) {
                if (response === "Y") {
                    await ctx.reply(quote("🎉 Permainan dimulai!"));

                    const chessGame = new Chess();
                    const gameSession = {
                        chess: chessGame,
                        currentTurn: "w",
                        turnTimeout: null
                    };

                    session.set(ctx.id, gameSession);

                    await ctx.reply(
                        `${quote("Papan catur:")}\n` +
                        `${chessGame.ascii()}\n` +
                        `${quote(`Giliran Putih untuk bergerak.`)}\n` +
                        "\n" +
                        global.config.msg.footer
                    );

                    const startTurnTimer = (turnTime) => {
                        gameSession.turnTimeout = setTimeout(async () => {
                            session.delete(ctx.id);
                            await ctx.reply(quote("⏳ Waktu habis! Permainan berakhir."));
                        }, turnTime);
                    };

                    const playerTurn = async () => {
                        await ctx.reply(quote(`Giliran ${chessGame.turn() === "w" ? "Putih" : "Hitam"} untuk bergerak.`));
                        startTurnTimer(60000); // 60 detik.
                    };

                    playerTurn();

                    collector.on("collect", async (m) => {
                        const move = m.content.trim().toLowerCase();
                        const moveSenderJid = m.key.participant;

                        if (moveSenderJid !== senderJid && moveSenderJid !== opponentJid) return;

                        clearTimeout(gameSession.turnTimeout);

                        const result = chessGame.move(move);

                        if (!result) return await ctx.reply(quote("Gerakan tidak valid! Gunakan notasi standar catur (contoh: e4, Nf3)."));

                        if (chessGame.in_checkmate()) {
                            session.delete(ctx.id);
                            await Promise.all([
                                global.db.add(`user.${moveSenderJid === senderJid ? senderJid : opponentJid}.coin`, coin),
                                global.db.add(`user.${moveSenderJid === senderJid ? senderJid : opponentJid}.winGame`, 1)
                            ]);
                            return await ctx.reply(quote(`Skakmat! ${moveSenderJid === senderJid ? "Anda" : "Lawan"} menang!`));
                        } else if (chessGame.in_draw()) {
                            session.delete(ctx.id);
                            return await ctx.reply(quote("Permainan berakhir dengan remis!"));
                        }

                        gameSession.currentTurn = chessGame.turn();
                        session.set(ctx.id, gameSession);

                        await ctx.reply(
                            `${quote(`Gerakan dimainkan: ${result.san}`)}\n` +
                            `${quote("Papan saat ini:")}\n` +
                            `${chessGame.ascii()}\n` +
                            `${quote(`Giliran ${chessGame.turn() === "w" ? "Putih" : "Hitam"} untuk bergerak.`)}\n` +
                            "\n" +
                            global.config.msg.footer
                        );

                        playerTurn();
                    });

                    collector.on("end", async () => {
                        session.delete(ctx.id);
                        await ctx.reply(quote("⏳ Waktu habis! Permainan berakhir."));
                    });

                } else if (response === "N") {
                    await ctx.reply(quote("❌ Permainan dibatalkan."));
                    collector.stop();
                } else {
                    await ctx.reply(quote("❌ Mohon ketik Y untuk setuju atau N untuk menolak."));
                }
            }
        });

        collector.on("end", async () => {
            await ctx.reply(quote("⏳ Waktu menunggu habis! Permainan dibatalkan."));
        });
    }
};