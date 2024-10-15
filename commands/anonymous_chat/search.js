const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "search",
    aliases: ["cari"],
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

        if (currentPartner) return await ctx.reply(quote(`❎ Kamu sudah terhubung dengan partner anonim lain. Gunakan ${ctx._used.prefix}next untuk mencari partner baru.`));

        let queue = await global.db.get("anonChatQueue") || [];
        queue.push(senderNumber);
        await global.db.set("anonChatQueue", queue);

        if (queue.length > 1) {
            const partnerNumber = queue.shift();
            await global.db.set(`anonChat.${senderNumber}.partner`, partnerNumber);
            await global.db.set(`anonChat.${partnerNumber}.partner`, senderNumber);
            await global.db.set("anonChatQueue", chatQueue);

            await ctx.sendMessage(partner + S_WHATSAPP_NET, {
                text: quote(`✅ Kamu telah terhubung dengan partner. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`)
            });
            return await ctx.reply(quote(`✅ Kamu telah terhubung dengan partner. Ketik ${ctx._used.prefix}next untuk mencari yang lain, atau ${ctx._used.prefix}stop untuk berhenti.`));
        } else {
            return await ctx.reply(quote(`🔄 Sedang mencari partner chat... Tunggu hingga ada orang lain yang mencari.`));
        }
    }
};