const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    category: "tools",
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid.split(/[:@]/)[0]
            const users = (await db.toJSON()).user;

            const leaderboardData = Object.keys(users)
                .map(userId => ({
                    userId,
                    level: users[userId].level || 0,
                    winGame: users[userId].winGame || 0
                }))
                .sort((a, b) => {
                    if (b.winGame !== a.winGame) return b.winGame - a.winGame;
                    return b.level - a.level;
                });

            const userRank = leaderboardData.findIndex(user => user.userId === senderJid) + 1;

            const topUsers = leaderboardData.slice(0, 9);

            let resultText = "";
            topUsers.forEach((user, index) => {
                resultText += quote(`${index + 1}. @${user.userId} - Menang: ${user.winGame}, Level: ${user.level}\n`);
            });

            if (userRank > 9) {
                const userStats = leaderboardData[userRank - 1];
                resultText += quote(`10. @${senderJid} - Menang: ${userStats.winGame}, Level: ${userStats.level}`);
            }

            const userMentions = topUsers.map(user => user.userId + S_WHATSAPP_NET);
            if (userRank > 9) userMentions.push(senderJid + S_WHATSAPP_NET);

            return await ctx.reply({
                text: `${resultText.trim()}\n` +
                    "\n" +
                    config.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};