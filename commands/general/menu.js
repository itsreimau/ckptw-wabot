const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "general",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        try {
            const text = await tools.list.get("menu", ctx);
            const fakeProduct = {
                key: {
                    fromMe: false,
                    participant: 13135550002 + S_WHATSAPP_NET,
                    ...({
                        remoteJid: "status@broadcast"
                    })
                },
                message: {
                    productMessage: {
                        product: {
                            title: config.bot.name,
                            description: null,
                            currencyCode: "IDR",
                            priceAmount1000: "1000",
                            retailerId: config.bot.name,
                            productImageCount: 0
                        },
                        businessOwnerJid: ctx.sender.jid
                    }
                }
            };

            return await ctx.sendMessage(ctx.id, {
                text: text,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: config.bot.picture.thumbnail,
                        sourceUrl: config.bot.website
                    },
                    forwardingScore: 9999,
                    isForwarded: true
                },
                mentions: [ctx.sender.jid]
            }, {
                quoted: fakeProduct
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};