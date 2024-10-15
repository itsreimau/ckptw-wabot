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
        private: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const currentPartner = await global.db.get(`anonChat.${senderNumber}.partner`);

        if (currentPartner) {
            await ctx.sendMessage(currentPartner + S_WHATSAPP_NET, {
                text: quote(`❎ Partner kamu telah meninggalkan chat.`)
            });
            await global.db.delete(`anonChat.${currentPartner}`);
        }

        const chatQueue = await global.db.get("anonChatQueue") || [];

        if (chatQueue.length > 0) {
            const partnerNumber = chatQueue.shift();
            await global.db.set(`anonChat.${senderNumber}.partner`, partnerNumber);
            await global.db.set(`anonChat.${partnerNumber}.partner`, senderNumber);
            await global.db.set("anonChatQueue", chatQueue);

            await ctx.sendMessage(partnerNumber + S_WHATSAPP_NET, {
                text: quote(`✅ Kamu telah terhubung dengan partner. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`)
            });
            return await ctx.reply(quote(`✅ Kamu telah terhubung dengan partner baru. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`));
        } else {
            chatQueue.push(senderNumber);
            await global.db.set("anonChatQueue", chatQueue);
            return await ctx.reply(quote(`🔄 Sedang mencari partner baru... Tunggu hingga ada orang lain yang mencari.`));
        }
    }
};