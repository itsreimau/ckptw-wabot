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

            const userDb = await db.get(`user.${senderId}`);

            const isOwner = await tools.general.isOwner(ctx, senderId, true);

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
                    `${quote(`Status: ${isOwner ? "Owner" : userDb.premium ? "Premium" : "Freemium"}`)}\n` +
                    `${quote(`Level: ${userDb.level}`)}\n` +
                    `${quote(`XP: ${userDb.xp}`)}\n` +
                    `${quote(`Koin: ${isOwner || userDb.premium ? "Tak terbatas" : userDb.coin || "-"}`)}\n` +
                    `${quote(`Peringkat: ${userRank}`)}\n` +
                    `${quote(`Menang: ${userDb.winGame}`)}\n` +
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