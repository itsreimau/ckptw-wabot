module.exports = {
    name: 'donate',
    aliases: ['donasi'],
    category: 'info',
    code: async (ctx) => {
        return ctx.sendMessage(ctx.id, {
            text: `• 083838039693 (DANA)\n` +
                `• https://paypal.me/itsreimau (PayPal)\n` +
                `• https://saweria.co/itsreimau/ (Saweria)\n` +
                `• https://trakteer.id/itsreimau (Trakteer)`,
            contextInfo: {
                externalAdReply: {
                    title: `D O N A T E`,
                    body: null,
                    thumbnailUrl: global.bot.thumbnail,
                    sourceUrl: global.bot.groupChat,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: ctx._msg
        });
    }
};