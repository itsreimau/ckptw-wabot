const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "listpremium",
    aliases: ["listprem"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const users = (await db.toJSON()).user;
            const premiumUsers = [];

            for (const userId in users) {
                if (users[userId].premium === true) premiumUsers.push(userId);
            }

            let resultText = "";
            let userMentions = [];

            premiumUsers.forEach(userId => {
                resultText += `${quote(`@${userId}`)}\n`;
            });

            premiumUsers.forEach(userId => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

            return await ctx.reply({
                text: `${resultText}` +
                    "\n" +
                    config.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};