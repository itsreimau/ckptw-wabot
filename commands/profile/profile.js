const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderName = ctx.sender.pushName;
            const senderJid = ctx.sender.jid;
            const senderId = tools.general.getID(senderJid);

            const leaderboardData = Object.entries((await db.toJSON()).user)
                .map(([id, data]) => ({
                    id,
                    winGame: data.winGame || 0,
                    level: data.level || 0
                }))
                .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userDb = await db.get(`user.${senderId}`) || {};
            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;
            const isOwner = tools.general.isOwner(senderId, ctx.msg.key.id);
            const profilePictureUrl = await ctx.core.profilePictureUrl(senderJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const canvas = tools.api.createUrl("fast", "/canvas/rank", {
                avatar: profilePictureUrl,
                background: config.bot.thumbnail,
                username: senderName,
                status: "online",
                level: userDb?.level,
                rank: userRank,
                currentXp: userDb?.xp,
                requiredXp: "100"
            });

            const text = `${quote(`Nama WhatsApp: ${senderName}`)}\n` +
                `${quote(`Username: ${userDb?.username}`)}\n` +
                `${quote(`Status: ${isOwner ? "Owner" : userDb?.premium ? "Premium" : "Freemium"}`)}\n` +
                `${quote(`Level: ${userDb?.level || 0}`)}\n` +
                `${quote(`XP: ${userDb?.xp}/100`)}\n` +
                `${quote(`Koin: ${isOwner || userDb?.premium ? "Tak terbatas" : userDb?.coin}`)}\n` +
                `${quote(`Peringkat: ${userRank}`)}\n` +
                `${quote(`Menang: ${userDb?.winGame || 0}`)}\n` +
                "\n" +
                config.msg.footer;

            try {
                return await ctx.reply({
                    video: {
                        url: (await axios.get(tools.api.createUrl("bk9", "/converter/png2gif", {
                            url: canvas
                        }))).data.BK9
                    },
                    mimetype: mime.lookup("png"),
                    caption: text,
                    gifPlayback: true
                });
            } catch (error) {
                if (error.status !== 200) return await ctx.reply(text);
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};