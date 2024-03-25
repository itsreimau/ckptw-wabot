const {
    getMenu
} = require('../lib/menu.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);

            return ctx.sendMessage(ctx.id, {
                text: text,
                contextInfo: {
                    externalAdReply: {
                        title: 'Halo Dunia!',
                        body: 'Apa kabar?',
                        thumbnailUrl: 'https://i.pinimg.com/originals/11/c0/ae/11c0aebed4192be78f5049a3c044c450.jpg',
                        sourceUrl: 'https://chat.whatsapp.com/FlqTGm4chSjKMsijcqAIJs',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: ctx._msg
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};