module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid;
            const senderId = ctx.getId(senderJid);

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

            return await ctx.reply({
                text: `${formatter.quote(`Nama: ${ctx.sender.pushName} (${userDb?.username})`)}\n` +
                    `${formatter.quote(`Status: ${isOwner ? "Owner" : userDb?.premium ? `Premium (${userDb?.premiumExpiration ? tools.msg.convertMsToDuration(userDb.premiumExpiration) : "Selamanya"})` : "Freemium"}`)}\n` +
                    `${formatter.quote(`Level: ${userDb?.level || 0} (${userDb?.xp || 0}/100)`)}\n` +
                    `${formatter.quote(`Koin: ${isOwner || userDb?.premium ? "Tak terbatas" : userDb?.coin}`)}\n` +
                    `${formatter.quote(`Menang: ${userDb?.winGame || 0}`)}\n` +
                    `${formatter.quote(`Peringkat: ${leaderboardData.findIndex(user => user.id === senderId) + 1}`)}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    externalAdReply: {
                        title: config.bot.name,
                        body: config.bot.version,
                        mediaType: 1,
                        thumbnailUrl: profilePictureUrl
                    }
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};