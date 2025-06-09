const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid;
            const senderId = tools.cmd.getID(senderJid);

            const leaderboardData = Object.entries((await db.toJSON()).user)
                .map(([id, data]) => ({
                    id,
                    winGame: data.winGame || 0,
                    level: data.level || 0
                }))
                .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userDb = await db.get(`user.${senderId}`) || {};
            const isOwner = tools.cmd.isOwner(senderId, ctx.msg.key.id);

            const profilePictureUrl = await ctx.core.profilePictureUrl(senderJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const userStatus = isOwner ? "Owner" : userDb?.premium ? "Premium" : "Freemium";
            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;
            const userLevel = userDb?.level || 0;
            const senderName = ctx.sender.pushName;
            const canvas = tools.api.createUrl("siputzx", "/api/canvas/profile", {
                backgroundURL: config.bot.thumbnail,
                avatarURL: profilePictureUrl,
                rankName: userStatus.toUpperCase(),
                rankId: userRank,
                exp: userDb?.xp,
                requireExp: "100",
                level: userLevel,
                name: senderName
            });

            return await ctx.reply({
                text: `${quote(`Nama: ${senderName}`)}\n` +
                    `${quote(`Username: ${userDb?.username}`)}\n` +
                    `${quote(`Status: ${userStatus}`)}\n` +
                    `${quote(`Level: ${userLevel}`)}\n` +
                    `${quote(`XP: ${userDb?.xp}/100`)}\n` +
                    `${quote(`Koin: ${isOwner || userDb?.premium ? "Tak terbatas" : userDb?.coin}`)}\n` +
                    `${quote(`Peringkat: ${userRank}`)}\n` +
                    `${quote(`Menang: ${userDb?.winGame || 0}`)}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    externalAdReply: {
                        title: config.bot.name,
                        body: config.bot.note,
                        mediaType: 1,
                        thumbnail: await tools.cmd.fillImageWithBlur(canvas),
                        renderLargerThumbnail: true
                    }
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};