const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "general",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        try {
            const text = await tools.list.get("menu", ctx);
            const fakeText = {
                key: {
                    fromMe: false,
                    participant: "13135550002@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: "”Those who hate themselves, cannot love or trust others.”",
                        title: config.bot.name
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
                        thumbnailUrl: config.bot.thumbnail,
                        sourceUrl: config.bot.website
                    },
                    forwardingScore: 9999,
                    isForwarded: true
                },
                mentions: [ctx.sender.jid]
            }, {
                quoted: fakeText
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};