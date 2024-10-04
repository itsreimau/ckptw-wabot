const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "profile",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true,
        });
        if (status) return ctx.reply(message);

        try {
            const senderName = ctx.sender.pushName || "-";
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");

            const [userCoin = 0, isPremium, userXp = 0, userLevel = 1, isOwner] = await Promise.all([
                global.db.get(`user.${senderNumber}.coin`),
                global.db.get(`user.${senderNumber}.isPremium`),
                global.db.get(`user.${senderNumber}.xp`),
                global.db.get(`user.${senderNumber}.level`),
                global.tools.general.isOwner(ctx, senderNumber, true),
            ]);

            const isPremiumOrOwner = isOwner || isPremium;

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch {
                profilePictureUrl = global.config.bot.picture.profile;
            }
            const card = global.tools.api.createUrl("aggelos_007", "/rankcard", {
                username: senderName,
                xp: userXp,
                maxxp: "100",
                level: userLevel,
                avatar: profilePictureUrl,
            });

            return await ctx.reply({
                image: {
                    url: card || profilePictureUrl,
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Nama: ${senderName}`)}\n` +
                    `${quote(`Koin: ${isPremiumOrOwner ? "Tak terbatas" : (userCoin || "-")}`)}\n` +
                    `${quote(`XP: ${userXp}`)}\n` +
                    `${quote(`Level: ${userLevel}`)}\n` +
                    `${quote(`Premium: ${isPremium ? "Ya" : "Tidak"}`)}\n` +
                    `${quote(`Owner: ${isOwner ? "Ya" : "Tidak"}`)}\n` +
                    "\n" +
                    global.config.msg.footer,
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    },
};