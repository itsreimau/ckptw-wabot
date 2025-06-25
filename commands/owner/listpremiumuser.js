module.exports = {
    name: "listpremiumuser",
    aliases: ["listprem", "listpremium"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = db.get("user");
            const premiumUsers = [];

            for (const userId in users) {
                if (users[userId].premium === true) {
                    premiumUsers.push({
                        id: userId,
                        expiration: users[userId].premiumExpiration
                    });
                }
            }

            let resultText = "";
            let userMentions = [];

            for (const user of premiumUsers) {
                userMentions.push(`${user.id}@s.whatsapp.net`);

                if (user.expiration) {
                    const daysLeft = Math.ceil((user.expiration - Date.now()) / (24 * 60 * 60 * 1000));
                    resultText += `${formatter.quote(`@${user.id} (${daysLeft} hari tersisa)`)}\n`;
                } else {
                    resultText += `${formatter.quote(`@${user.id} (Premium permanen)`)}\n`;
                }
            }

            return await ctx.reply({
                text: `${resultText.trim() || config.msg.notFound}\n` +
                    "\n" +
                    config.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};