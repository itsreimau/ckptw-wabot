const {
    caklontong
} = require("@bochilteam/scraper");
const {
    bold
} = require("@mengkodingan/ckptw");

const session = new Map();

module.exports = {
    name: "caklontong",
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
            const data = await caklontong();
            const coin = 3;
            const timeout = 60000;
            const senderNumber = ctx._sender.jid.split("@")[0];

            await session.set(ctx.id, true);

            await ctx.reply(
                `❖ ${bold("Cak Lontong")}\n` +
                "\n" +
                `➲ Soal: ${data.soal}` +
                (global.system.useCoin ?
                    "\n" +
                    `+${coin} Koin` :
                    "\n") +
                `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
                'Ketik "hint" untuk bantuan.\n' +
                "\n" +
                global.msg.footer
            );

            const col = ctx.MessageCollector({
                time: timeout
            });

            col.on("collect", async (m) => {
                    const userAnswer = m.content.toLowerCase();
                    const answer = data.jawaban.toLowerCase();

                    if (userAnswer === answer) {
                        await session.delete(ctx.id);
                        if (global.system.useCoin) await global.db.add(`user.${senderNumber}.coin`, coin);
                        await ctx.sendMessage(
                            ctx.id, {
                                text: `${bold("[ ! ]")} Benar!\n` +
                                    `${data.description}` +
                                    (global.system.useCoin ?
                                        "\n" +
                                        `+${coin} Koin` :
                                        "")
                            }, {
                                quoted: m
                            });
                        return col.stop();
                    } else if (userAnswer === "hint") {
                        const clue = answer.replace(/[AIUEOaiueo]/g, "_");
                        await ctx.reply(ctx.id, {
                                text: clue.toUpperCase()
                        }, {
                            quoted: m
                        });
                } else if (userAnswer.endsWith(answer.split(" ")[1])) {
                    ctx.reply(ctx.id, {
                        text: "Sedikit lagi!"
                    }, {
                        quoted: m
                    });
                }
            });

        col.on("end", async (collector, r) => {
            const answer = data.jawaban;
            const description = data.description;

            if (await session.has(ctx.id)) {
                await session.delete(ctx.id);

                return ctx.reply(
                    `Waktu habis!\n` +
                    `Jawabannya adalah ${answer}.\n` +
                    description
                );
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
    }
}
};