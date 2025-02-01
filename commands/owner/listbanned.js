const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "listbanned",
    aliases: ["listban"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = (await db.toJSON()).user;
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].banned === true) bannedUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            bannedUsers.forEach((userId) => {
                resultText += `${quote(`@${userId}`)}\n`;
            });

            bannedUsers.forEach((userId) => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

            return await ctx.reply({
                text: `${resultText}` +
                    "\n" +
                    config.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};