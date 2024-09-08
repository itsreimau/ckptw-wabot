const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "tebakkimia",
    category: "game",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        if (session.has(ctx.id)) return await ctx.reply(quote(`⚠ Sesi permainan sedang berjalan!`));

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", `/ramadhankukuh/database/master/src/games/tebakkimia.json`, {});
            const response = await axios.get(apiUrl);
            const data = global.tools.general.getRandomElement(response.data);
            const coin = 3;
            const timeout = 60000;
            const senderNumber = ctx.sender.jid.replace(/@.*|:.*/g, "");

            await session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`c: ${data.lambang}`)}` +
                (global.system.useCoin ?
                    "\n" +
                    `${quote(`+${coin} ${await global.tools.msg.translate("Koin", userLanguage)}`)}\n` :
                    "\n") +
                `${quote(await global.tools.msg.translate(`Batas waktu ${(timeout / 1000).toFixed(2)} detik.`, userLanguage))}\n` +
                `${quote(await global.tools.msg.translate('Ketik "hint" untuk bantuan.', userLanguage))}\n` +
                "\n" +
                global.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.unsur.toLowerCase();

                if (userAnswer === answer) {
                    await session.delete(ctx.id);
                    if (global.system.useCoin) await global.db.add(`user.${senderNumber}.coin`, coin);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: quote(`💯 ${await global.tools.msg.translate("Benar!", userLanguage)}`) +
                                (global.system.useCoin ?
                                    "\n" +
                                    quote(`+${coin} ${await global.tools.msg.translate("Koin", userLanguage)}`) :
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
                }
            });

            collector.on("end", async (collector, reason) => {
                const answer = data.unsur;

                if (await session.has(ctx.id)) {
                    await session.delete(ctx.id);

                    return ctx.reply(
                        `${quote(`⌛ ${await global.tools.msg.translate("Waktu habis!", userLanguage)}`)}\n` +
                        quote(`${await global.tools.msg.translate("Jawabannya adalah", userLanguage)} ${answer}.`)
                    );
                }
            });

        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};