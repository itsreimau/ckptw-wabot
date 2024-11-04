const {
    quote,
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "contact",
    aliases: ["kontak"],
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

        if (!currentPartner) return await ctx.reply(quote(`❎ Kamu tidak sedang dalam chat. Gunakan ${ctx._used.prefix}search untuk mencari partner.`));

        const vcard = new VCardBuilder()
            .setFullName(ctx.sender.pushName)
            .setOrg(config.owner.organization)
            .setNumber(senderNumber).build();

        await ctx.sendMessage(`${currentPartner}@s.whatsapp.net`, {
            contacts: {
                displayName: ctx.sender.pushName,
                contacts: [{
                    vcard
                }]
            }
        });
        return await ctx.reply(quote(`✅ Kontak telah dikirim ke partner.`));
    }
};