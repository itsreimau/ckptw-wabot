const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tagme",
    category: "group",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            group: true
        });
        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const senderNumber = ctx.sender.jid.split("@")[0];
            const senderJid = ctx._sender.jid;

            return ctx.reply({
                text: `@${senderNumber}`,
                mentions: [senderJid]
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};