const {
    susunkata
} = require("@bochilteam/scraper");
const {
    bold
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

        if (session.has(ctx.id)) return await ctx.reply(`${bold("[ ! ]")} Sesi permainan sedang berjalan!`);

        try {
            const data = await tebakbendera();
            const coin = 3;
            const timeout = 60000;
            const senderNumber = ctx._sender.jid.split("@")[0];

            await session.set(ctx.id, true);

            await ctx.reply({
                image: {
                    url: data.img
                },
                caption: `❖ ${bold("Susun Kata")}\n` +
                    "\n" +
                    `+${coin} Koin` +
                    `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
                    'Ketik "hint" untuk bantuan.\n' +
                    "\n" +
                    global.msg.footer
            });

            const col = ctx.MessageCollector({
                time: timeout
            });

            col.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.jawaban.toLowerCase();

                if (userAnswer === answer.toLowerCase()) {
                    await session.delete(ctx.id);
                    if (global.system.useCoin) await global.db.add(`user.${senderNumber}.coin`, coin);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: `${bold("[ ! ]")} Benar!` +
                                (global.system.useCoin ?
                                    "\n" +
                                    `+${coin} Koin` :
                                    "")
                        }, {
                            quoted: m.key
                        }
                    );
                    return col.stop();
                } else if (userAnswer === "hint") {
                    const clue = answer.replace(/[AIUEOaiueo]/g, "_");
                    await ctx.reply(clue);
                } else if (userAnswer.endsWith(answer.split(" ")[1].toLowerCase())) {
                    await ctx.reply("Sedikit lagi!");
                }
            });

            col.on("end", async (collector, r) => {
                const answer = data.jawaban;

                if (await session.has(ctx.id)) {
                    await session.delete(ctx.id);
                    return ctx.reply(
                        `Waktu habis!\n` +
                        `Jawabannya adalah ${answer}.`
                    );
                }
            });

        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};