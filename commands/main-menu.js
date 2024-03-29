const {
    getMenu
} = require('../lib/menu.js');
const package = require('./package.json');
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
                        title: `${package.name}@^${package.version}`,
                        body: package.description,
                        thumbnailUrl: global.bot.thumbnail,
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