const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "next",
    aliases: ["selanjutnya"],
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
        const botNumber = config.bot.number;
        const currentPartner = await db.get(`anonymous_chat.conversation.${senderNumber}.partner`);

        if (currentPartner && currentPartner !== botNumber) {
            await ctx.sendMessage(currentPartner + S_WHATSAPP_NET, {
                text: quote(`❎ Partner kamu telah meninggalkan chat.`)
            });
            await db.delete(`anonymous_chat.conversation.${currentPartner}`);
        }

        await db.delete(`anonymous_chat.conversation.${senderNumber}`);

        let chatQueue = await db.get("anonymous_chat.queue") || [];

        if (chatQueue.length > 0) {
            let partnerNumber;
            do {
                partnerNumber = chatQueue.shift();
            } while ((partnerNumber === senderNumber || partnerNumber === botNumber) && chatQueue.length > 0);

            if (partnerNumber && partnerNumber !== senderNumber && partnerNumber !== botNumber) {
                await db.set(`anonymous_chat.conversation.${senderNumber}.partner`, partnerNumber);
                await db.set(`anonymous_chat.conversation.${partnerNumber}.partner`, senderNumber);
                await db.set("anonymous_chat.queue", chatQueue);

                await ctx.sendMessage(partnerNumber + S_WHATSAPP_NET, {
                    text: quote(`✅ Kamu telah terhubung dengan partner baru. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`)
                });
                return await ctx.reply(quote(`✅ Kamu telah terhubung dengan partner baru. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`));
            }
        }

        chatQueue.push(senderNumber);
        await db.set("anonymous_chat.queue", chatQueue);
        return await ctx.reply(quote(`🔄 Sedang mencari partner baru... Tunggu hingga ada orang lain yang mencari.`));
    }
};