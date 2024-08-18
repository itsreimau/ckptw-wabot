const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tagme",
    category: "group",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            group: true
        });
        if (status) return ctx.reply(message);

        try {
            const senderJid = ctx._sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");

            return ctx.reply({
                text: `@${senderNumber}`,
                mentions: [senderJid]
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};