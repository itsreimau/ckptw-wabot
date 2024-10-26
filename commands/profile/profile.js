const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "profile",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        try {
            const senderName = ctx.sender.pushName || "-";
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.split(/[:@]/)[0];

            const [userCoin = 0, isOwner, isPremium, userLevel = 1, userXp = 0] = await Promise.all([
                db.get(`user.${senderNumber}.coin`),
                tools.general.isOwner(ctx, senderNumber, true),
                db.get(`user.${senderNumber}.isPremium`),
                db.get(`user.${senderNumber}.level`),
                db.get(`user.${senderNumber}.xp`),
            ]);

            const userStatus = isOwner ? "Owner" : (isPremium ? "Premium" : "Freemium");

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = config.bot.picture.profile;
            }
            const card = tools.api.createUrl("aggelos_007", "/rankcard", {
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
                mimetype: mime.lookup("png"),
                caption: `${quote(`Nama: ${senderName}`)}\n` +
                    `${quote(`Status: ${userStatus}`)}\n` +
                    `${quote(`Level: ${userLevel}`)}\n` +
                    `${quote(`Koin: ${userCoin || "-"}`)}\n` +
                    `${quote(`XP: ${userXp}`)}\n` +
                    "\n" +
                    config.msg.footer,
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    },
};