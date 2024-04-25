const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'listbanned',
    category: 'info',
    code: async (ctx) => {
        try {
            const databaseJSON = global.db.toJSON();
            const parsedDB = JSON.parse(databaseJSON);
            const users = parsedDB.user;
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].isBanned === true) bannedUsers.push(userId);
            }

            let resultText;

            bannedUsers.forEach(userId => {
                resultText += `➤ @${userId}\n`;
            });

            return ctx.reply({
                text: `❖ ${bold('List Banned')}\n` +
                    '\n' +
                    `${resultText || 'Tidak ada.'}` +
                    '\n' +
                    global.msg.footer,
                mentions: ctx.getMentioned()
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};