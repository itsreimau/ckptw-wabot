const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

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

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg";
            }

            return await ctx.reply({
                text: `${quote(`Nama: ${senderName}`)}\n` +
                    `${quote(`Status: ${isOwner ? "Owner" : (isPremium ? "Premium" : "Freemium")}`)}\n` +
                    `${quote(`Level: ${userLevel}`)}\n` +
                    `${quote(`Koin: ${isOwner ? "Tak terbatas" : isPremium ? "Tak terbatas" : userCoin || "-"}`)}\n` +
                    `${quote(`XP: ${userXp}`)}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profilePictureUrl || config.bot.thumbnail,
                        sourceUrl: config.bot.website
                    }
                }
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    },
};