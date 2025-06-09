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

            return await ctx.reply({
                text: `${quote(`👋 Halo! Saya adalah Bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)}\n` + // Dapat diubah sesuai keinginan Anda
                    `${quote("─────")}\n` +
                    `${quote(`Nama Bot: ${config.bot.name}`)}\n` +
                    `${quote(`Versi: ${pkg.version}`)}\n` +
                    `${quote(`Owner: ${tools.msg.ucwords(config.owner.name)}`)}\n` +
                    `${quote(`Mode: ${tools.msg.ucwords(botDb?.mode)}`)}\n` +
                    `${quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                    `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                    `${quote("Library: @itsreimau/ckptw-mod (Fork of @mengkodingan/ckptw)")}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    externalAdReply: {
                        title: config.bot.name,
                        body: config.msg.note,
                        mediaType: 1,
                        thumbnailUrl: config.bot.thumbnail,
                        renderLargerThumbnail: true
                    }
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};