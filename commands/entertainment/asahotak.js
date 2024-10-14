const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    jidDecode
} = require("@whiskeysockets/baileys");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "asahotak",
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        if (session.has(ctx.id)) return await ctx.reply(quote(`🎮 Sesi permainan sedang berjalan!`));

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", "/ramadhankukuh/database/master/src/games/asahotak.json", {});
            const response = await axios.get(apiUrl);
            const data = global.tools.general.getRandomElement(response.data);
            const coin = 3;
            const timeout = 60000;
            const senderJidDecode = jidDecode(ctx.sender.jid);
            const senderNumber = senderJidDecode.user;

            session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`Soal: ${data.soal}`)}\n` +
                `${quote(`+${coin} Koin`)}\n` +
                `${quote(`Batas waktu ${(timeout / 1000).toFixed(2)} detik.`)}\n` +
                `${quote('Ketik "hint" untuk bantuan.')}\n` +
                "\n" +
                global.config.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.jawaban.toLowerCase();

                if (userAnswer === answer) {
                    session.delete(ctx.id);
                    await Promise.all([
                        await global.db.add(`user.${senderNumber}.coin`, coin),
                        await global.db.add(`user.${senderNumber}.winGame`, 1)
                    ]);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: `${quote("💯 Benar!")}\n` +
                                quote(`+${coin} Koin`)
                        }, {
                            quoted: m
                        }
                    );
                    return collector.stop();
                } else if (userAnswer === "hint") {
                    const clue = answer.replace(/[AIUEOaiueo]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: monospace(clue.toUpperCase())
                    }, {
                        quoted: m
                    });
                }
            });

            collector.on("end", async (collector, reason) => {
                const answer = data.jawaban;

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);

                    return ctx.reply(
                        `${quote("⌛ Waktu habis!")}\n` +
                        quote(`Jawabannya adalah ${answer}.`)
                    );
                }
            });

        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};