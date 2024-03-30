const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'donate',
    aliases: ['donasi'],
    category: 'info',
    code: async (ctx) => {
        return ctx.sendMessage(ctx.id, {
            text: `${bold('Pulsa')}\n` +
                '• 083838039693 (DANA)\n' +
                '----\n' +
                `${bold('Non Pulsa')}` +
                '• https://paypal.me/itsreimau (PayPal)\n' +
                '• https://saweria.co/itsreimau (Saweria)\n' +
                '• https://trakteer.id/itsreimau (Trakteer)',
            contextInfo: {
                externalAdReply: {
                    title: `D O N A T E`,
                    body: null,
                    thumbnailUrl: 'https://www.morrisrestore.org/wp-content/uploads/2016/11/donation-center-near-me.jpg',
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