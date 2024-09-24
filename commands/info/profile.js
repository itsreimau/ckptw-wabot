const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "info",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        try {
            const senderName = ctx.sender.pushName;
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");

            const [energy, isPremium, onCharger, estimatedTime] = await Promise.all([
                global.db.get(`user.${senderNumber}.energy`),
                global.db.get(`user.${senderNumber}.isPremium`),
                global.db.get(`user.${senderNumber}.onCharger`),
                global.db.get(`user.${senderNumber}.estimatedTime`)
            ]);

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = global.config.bot.picture.profile;
            }

            const card = global.tools.api.createUrl("aggelos_007", "/rankcard", {
                username: senderName,
                xp: isPremium ? 100 : (energy || 0),
                maxxp: "100",
                level: "0",
                avatar: profilePictureUrl
            });

            return await ctx.reply({
                image: {
                    url: card || profilePictureUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Nama: ${ctx.sender.pushName || "-"}`)}\n` +
                    `${quote(`Premium: ${isPremium ? "Ya" : "Tidak"}`)}\n` +
                    `${quote(`Energi: ${isPremium ? "Tak terbatas" : (energy || "-")}`)}\n` +
                    `${quote(`Pengisian energi: ${onCharger ? "Ya" : "Tidak"}`)} (${global.tools.general.convertMsToDuration(estimatedTime)})\n` +
                    "\n" +
                    global.config.msg.footer,
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};