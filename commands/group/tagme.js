const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tagme",
    category: "group",
    handler: {
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

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