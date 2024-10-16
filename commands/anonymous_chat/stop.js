const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "stop",
    aliases: ["berhenti"],
    category: "anonymous_chat",
    handler: {
        banned: true,
        cooldown: true,
        private: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const currentPartner = await global.db.get(`anonymous_chat.conversation.${senderNumber}.partner`);

        if (currentPartner) {
            await ctx.sendMessage(currentPartner + S_WHATSAPP_NET, {
                text: quote(`❎ Partner kamu telah menghentikan chat.`)
            });
            await global.db.delete(`anonymous_chat.conversation.${currentPartner}`);
        }

        const chatQueue = await global.db.get("anonymous_chat.queue") || [];
        const updatedQueue = chatQueue.filter((num) => num !== senderNumber);
        await global.db.set("anonymous_chat.queue", updatedQueue);

        await global.db.delete(`anonymous_chat.conversation.${senderNumber}`);

        return await ctx.reply(quote(`✅ Kamu telah keluar dari chat dan antrian.`));
    }
};