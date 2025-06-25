module.exports = {
    name: "listbanneduser",
    aliases: ["listban", "listbanned"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = db.get("user");
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].banned === true) bannedUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            bannedUsers.forEach(userId => {
                resultText += `${formatter.quote(`@${userId}`)}\n`;
            });

            bannedUsers.forEach(userId => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

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