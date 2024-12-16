const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const senderName = ctx.sender.pushName || "-";
            const senderJid = ctx.sender.jid;
            const senderId = senderJid.split(/[:@]/)[0];

            const [userCoin, isOwner, userPremium, userLevel, userXp, userWinGame] = await Promise.all([
                db.get(`user.${senderId}.coin`) || 0,
                tools.general.isOwner(ctx, senderId, true),
                db.get(`user.${senderId}.premium`),
                db.get(`user.${senderId}.level`) || 1,
                db.get(`user.${senderId}.xp`) || 0,
                db.get(`user.${senderId}.winGame`) || 0
            ]);

            const leaderboardData = Object.entries((await db.toJSON()).user)
                .map(([id, data]) => ({
                    id,
                    winGame: data.winGame || 0,
                    level: data.level || 0
                }))
                .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;

            const profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            return await ctx.reply({
                text: `${quote(`Nama: ${senderName}`)}\n` +
                    `${quote(`Status: ${isOwner ? "Owner" : userPremium ? "Premium" : "Freemium"}`)}\n` +
                    `${quote(`Level: ${userLevel}`)}\n` +
                    `${quote(`XP: ${userXp}`)}\n` +
                    `${quote(`Koin: ${isOwner || userPremium ? "Tak terbatas" : userCoin || "-"}`)}\n` +
                    `${quote(`Peringkat: ${userRank}`)}\n` +
                    `${quote(`Menang: ${userWinGame}`)}\n` +
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
                        thumbnailUrl: profilePictureUrl,
                        sourceUrl: config.bot.website
                    }
                }
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};