const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tagme",
    category: "group",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid;
            const senderId = senderJid.split(/[:@]/)[0];

            return await ctx.reply({
                text: `@${senderId}`,
                mentions: [senderJid]
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};