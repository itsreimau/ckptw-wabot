const pkg = require("../../package.json");
const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "about",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const botDb = await db.get("bot") || {};

            const text = `${quote(`👋 Halo! Saya adalah Bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)}\n` + // Dapat diubah sesuai keinginan Anda
                `${quote("─────")}\n` +
                `${quote(`Nama Bot: ${config.bot.name}`)}\n` +
                `${quote(`Versi: ${pkg.version}`)}\n` +
                `${quote(`Owner: ${tools.general.ucwords(config.owner.name)}`)}\n` +
                `${quote(`Mode: ${tools.general.ucwords(botDb?.mode)}`)}\n` +
                `${quote(`Bot Uptime: ${tools.general.convertMsToDuration(Date.now() - config.bot.readyAt)}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote("Library: @itsreimau/ckptw-mod (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                config.msg.footer

            const fakeQuotedText = {
                key: {
                    participant: "13135550002@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: config.msg.note
                    }
                }
            };
            const contextInfo = {
                mentionedJid: [senderJid],
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.bot.newsletterJid,
                    newsletterName: config.bot.name
                }
            };

            try {
                const video = (await axios.get(tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/img2vid", {
                    url: config.bot.thumbnail
                }))).data.result;
                return await ctx.sendMessage(ctx.id, {
                    video: {
                        url: video
                    },
                    mimetype: mime.lookup("mp4"),
                    caption: text,
                    gifPlayback: true,
                    contextInfo
                }, {
                    quoted: fakeQuotedText
                });
            } catch (error) {
                if (error.status !== 200) return await ctx.sendMessage(ctx.id, {
                    text,
                    contextInfo
                }, {
                    quoted: fakeQuotedText
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};