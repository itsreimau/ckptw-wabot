const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "listbanned",
    aliases: ["listban"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        try {
            const databaseJSON = JSON.stringify(global.db);
            const parsedDB = JSON.parse(databaseJSON);
            const users = parsedDB.user;
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].isBanned === true) bannedUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            bannedUsers.forEach((userId) => {
                resultText += `${quote(`@${userId}`)}\n`;
            });

            bannedUsers.forEach((userId) => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

            return ctx.reply({
                text: ` ${bold("List Banned")}\n` +
                    "\n" +
                    `${resultText}` +
                    "\n" +
                    global.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};