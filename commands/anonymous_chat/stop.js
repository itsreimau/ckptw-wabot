const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "stop",
    aliases: ["berhenti"],
    category: "anonymous_chat",
    handler: {
        banned: true,
        cooldown: true,
        private: true,
        restrict: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const currentPartner = await db.get(`anonymous_chat.conversation.${senderNumber}.partner`);

        if (currentPartner) {
            await ctx.sendMessage(`${currentPartner}@s.whatsapp.net`, {
                text: quote(`❎ Partner kamu telah menghentikan chat.`)
            });
            await db.delete(`anonymous_chat.conversation.${currentPartner}`);
        }

        const chatQueue = await db.get("anonymous_chat.queue") || [];
        const updatedQueue = chatQueue.filter((num) => num !== senderNumber);
        await db.set("anonymous_chat.queue", updatedQueue);

        await db.delete(`anonymous_chat.conversation.${senderNumber}`);

        return await ctx.reply(quote(`✅ Kamu telah keluar dari chat dan antrian.`));
    }
};