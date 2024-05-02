const package = require('../package.json');
const {
    getMenu
} = require('../tools/menu.js');
const {
    getRandomElement
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const fg = require('api-dylux');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);
            const thumbnail = await fg.googleImage('rei ayanami wallpaper');

            return ctx.sendMessage(ctx.id, {
                text: text,
                contextInfo: {
                    externalAdReply: {
                        title: global.msg.watermark,
                        body: null,
                        thumbnailUrl: getRandomElement(thumbnail) || global.bot.thumbnail,
                        sourceUrl: global.bot.groupChat,
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