const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "listpremium",
    aliases: ["listprem"],
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
                if (users[userId].isPremium === true) bannedUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            bannedUsers.forEach((userId) => {
                resultText += `➲ @${userId}\n`;
            });

            bannedUsers.forEach((userId) => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

            return ctx.reply({
                text: `❖ ${bold("List Premium")}\n` +
                    "\n" +
                    `${resultText}` +
                    "\n" +
                    global.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};