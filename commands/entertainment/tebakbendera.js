const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

const session = new Map();

module.exports = {
    name: "tebakbendera",
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        if (session.has(ctx.id)) return await ctx.reply(quote(`🎮 Sesi permainan sedang berjalan!`));

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/refs/heads/master/games/tebakbendera2.json", {});
            const response = await axios.get(apiUrl);
            const data = tools.general.getRandomElement(response.data);
            const coin = 5;
            const timeout = 60000;
            const senderNumber = ctx.sender.jid.split(/[:@]/)[0];

            session.set(ctx.id, true);

            await ctx.reply({
                image: {
                    url: data.img
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`+${coin} Koin`)}\n` +
                    `${quote(`Batas waktu ${timeout / 1000} detik.`)}\n` +
                    `${quote('Ketik "hint" untuk bantuan.')}\n` +
                    "\n" +
                    config.msg.footer
            });

            const collector = ctx.MessageCollector({
                time: timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toLowerCase();
                const answer = data.name.toLowerCase();

                if (userAnswer === answer) {
                    session.delete(ctx.id);
                    await Promise.all([
                        await db.add(`user.${senderNumber}.coin`, coin),
                        await db.add(`user.${senderNumber}.winGame`, 1)
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
                const answer = data.name;

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);

                    return await ctx.reply(
                        `${quote("⏱ Waktu habis!")}\n` +
                        quote(`Jawabannya adalah ${answer}.`)
                    );
                }
            });

        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};