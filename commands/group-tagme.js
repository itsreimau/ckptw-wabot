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
            banned: true,
            group: true,
            cooldown: true,
        });
        if (status) return ctx.reply(message);

        try {
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");

            return ctx.reply({
                text: `@${senderNumber}`,
                mentions: [senderJid]
            });
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};