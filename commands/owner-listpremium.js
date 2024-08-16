const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

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
            const premiumUsers = [];

            for (const userId in users) {
                if (users[userId].isPremium === true) premiumUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            premiumUsers.forEach((userId) => {
                resultText += `${quote(`@${userId}`)}\n`;
            });

            premiumUsers.forEach((userId) => {
                userMentions.push(userId + S_WHATSAPP_NET);
            });

            return ctx.reply({
                text: `${resultText}` +
                    "\n" +
                    global.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};