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
            return ctx.reply({
                text: `@${senderNumber}`,
                mentions: [ctx._sender.jid]
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};