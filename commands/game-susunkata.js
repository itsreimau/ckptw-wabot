const {
    susunkata
} = require("@bochilteam/scraper");
const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

const session = new Map();

module.exports = {
    name: "susunkata",
    category: "game",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        if (session.has(ctx.id)) return await ctx.reply(quote(`${bold("[ ! ]")} Sesi permainan sedang berjalan!`));

        try {
            const data = await susunkata();
            const coin = 3;
            const timeout = 60000;
            const senderNumber = ctx.sender.jid.split("@")[0];

            await session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`Soal: ${data.soal}`)}` +
                (global.system.useCoin ?
                    "\n" +
                    `${quote(`+${coin} Koin`)}\n` :
                    "\n") +
                `${quote(`Batas waktu ${(timeout / 1000).toFixed(2)} detik.`)}\n` +
                `${quote('Ketik "hint" untuk bantuan.')}\n` +
                "\n" +
                global.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.jawaban.toLowerCase();

                if (userAnswer === answer) {
                    await session.delete(ctx.id);
                    if (global.system.useCoin) await global.db.add(`user.${senderNumber}.coin`, coin);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: quote(`${bold("[ ! ]")} Benar!`) +
                                (global.system.useCoin ?
                                    "\n" +
                                    quote(`+${coin} Koin`) :
                                    "")
                        }, {
                            quoted: m
                        }
                    );
                    return collector.stop();
                } else if (userAnswer === "hint") {
                    const clue = answer.replace(/[AIUEOaiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: clue.toUpperCase()
                    }, {
                        quoted: m
                    });
                } else if (userAnswer.endsWith(answer.split(" ")[1].toLowerCase())) {
                    await ctx.reply(ctx.id, {
                        text: "Sedikit lagi!"
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async (collector, reason) => {
                const answer = data.jawaban;

                if (await session.has(ctx.id)) {
                    await session.delete(ctx.id);
                    return ctx.reply(
                        `${quote(`${bold("[ ! ]")} Waktu habis!`)}\n` +
                        `Jawabannya adalah ${answer}.`
                    );
                }
            });

        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};