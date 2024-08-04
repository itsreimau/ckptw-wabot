const {
    siapakahaku
} = require("@bochilteam/scraper");
const {
    bold
} = require("@mengkodingan/ckptw");

const session = new Map();

module.exports = {
    name: "siapakahaku",
    aliases: ["whoami"],
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
            const data = await siapakahaku();
            const coin = 3;
            const timeout = 60000;
            const senderNumber = ctx._sender.jid.split("@")[0];

            session.set(ctx.id, true);

            await ctx.reply(
                `❖ ${bold("Siapakah Aku")}\n` +
                `➲ Soal: ${data.soal}` +
                (global.system.useCoin ?
                    "\n" +
                    `➲ Bonus: ${coin} Koin\n` :
                    "\n") +
                `Batas waktu ${(timeout / 1000).toFixed(2)} detik.\n` +
                'Ketik "hint" untuk bantuan.\n' +
                global.msg.footer
            );

            const col = ctx.MessageCollector({
                time: timeout
            });

            col.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.name.toLowerCase();

                if (userAnswer === answer) {
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
                            quoted: m
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

            col.on("end", async (collector, reason) => {
                const answer = data.jawaban;

                if (session.has(ctx.id)) {
                    await session.delete(ctx.id);
                    await ctx.reply(
                        `${bold("[ ! ]")} Waktu habis!\n` +
                        `Jawabannya adalah ${answer}.`
                    );
                }
            });

        } catch (err) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};