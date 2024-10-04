const {
    quote
} = require("@mengkodingan/ckptw");
const jsChessEngine = require('js-chess-engine');

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

        try {
            let starting = false;
            const collector = ctx.MessageCollector({
                time: 30000 // 30 detik.
            });

            collector.on("collect", async (m) => {
                const response = m.content.trim().toUpperCase();
                const participantJid = m.key.participant;

                if (![senderJid, opponentJid].includes(participantJid)) return;

                if (participantJid === opponentJid) {
                    if (response === "Y") {
                        starting = true;
                        await startGame(m, ctx, senderJid, opponentJid);
                        collector.stop();
                    } else if (response === "N") {
                        await ctx.reply(quote("❌ Permainan dibatalkan."));
                        collector.stop();
                    } else {
                        await ctx.reply(quote("❌ Mohon ketik Y untuk setuju atau N untuk menolak."));
                    }
                }
            });

            collector.on("end", () => {
                if (!starting) return ctx.reply(quote("⏳ Waktu menunggu habis! Permainan dibatalkan."));
            });
        } catch (error) {
            console.error(error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function startGame(m, ctx, senderJid, opponentJid) {
    try {
        await ctx.reply(quote("🎉 Permainan dimulai!"));

        const game = new jsChessEngine.Game();
        const gameSession = {
            chess: game,
            currentTurn: "w",
            turnTimeout: null
        };
        session.set(ctx.id, gameSession);

        await sendBoard(m, ctx, game, "Giliran Putih untuk bergerak.");

        const turnHandler = async (m) => {
            const moveSenderJid = m.key.participant;
            const move = m.content.trim().toLowerCase();

            if (![senderJid, opponentJid].includes(moveSenderJid)) return;

            clearTimeout(gameSession.turnTimeout);
            const isValidMove = handleMove(ctx, gameSession, game, move);

            if (!isValidMove) await ctx.reply(quote("Gerakan tidak valid! Gunakan notasi standar catur (contoh: e4, Nf3)."));

            gameSession.currentTurn = gameSession.currentTurn === "w" ? "b" : "w";
            session.set(ctx.id, gameSession);

            if (game.isCheckmate()) {
                await endGame(m, ctx, moveSenderJid, `${quote("🏆 Skakmat! Anda menang!")}\n` + quote(`+50 Koin`));
            } else if (game.isDraw()) {
                await endGame(m, ctx, null, quote("Permainan berakhir dengan remis!"));
            } else {
                const nextTurn = gameSession.currentTurn === "w" ? "Putih" : "Hitam";
                await sendBoard(m, ctx, game, quote(`Giliran ${nextTurn} untuk bergerak.`));
                startTurnTimer(m, ctx, gameSession, 60000); // 60 detik.
            }
        };

        ctx.MessageCollector({
            time: 30000
        }).on("collect", turnHandler);
        startTurnTimer(ctx, gameSession, 60000); // 60 detik.
    } catch (error) {
        console.error(error);
        await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
    }
}

async function sendBoard(m, ctx, game, caption) {
    const fenUrl = global.tools.api.createUrl("https://fen2png.com", "/api/", {
        fen: game.exportFEN(),
        raw: true
    });

    await ctx.sendMessage(ctx.id, {
        image: {
            url: fenUrl
        },
        caption: caption
    }, {
        quoted: m
    });
}

async function handleMove(ctx, gameSession, game, move) {
    try {
        const result = game.move(move);
        return !!result;
    } catch {
        return false;
    }
}

async function startTurnTimer(m, ctx, gameSession, turnTime) {
    gameSession.turnTimeout = setTimeout(async () => {
        session.delete(ctx.id);
        await ctx.sendMessage(ctx.id, {
            text: quote("⏳ Waktu habis! Permainan berakhir.")
        }, {
            quoted: m
        });
    }, turnTime);
}

async function endGame(m, ctx, winnerJid, message) {
    session.delete(ctx.id);
    if (winnerJid) {
        await Promise.all([
            global.db.add(`user.${winnerJid}.coin`, 50),
            global.db.add(`user.${winnerJid}.winGame`, 1)
        ]);
    }
    await ctx.sendMessage(ctx.id, {
        text: message
    }, {
        quoted: m
    });
}