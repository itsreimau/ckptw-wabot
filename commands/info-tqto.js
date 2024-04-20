const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'tqto',
    aliases: ['thanksto'],
    category: 'info',
    code: async (ctx) => {
        return ctx.reply(
            `❖ ${bold('TQTO')}\n` +
            `\n` +
            '➤ Allah SWT\n' +
            '➤ Serv00 (https://serv00.com/)\n' +
            '➤ Idul (https://github.com/aidulcandra)\n' +
            '➤ JastinXyz (https://github.com/JastinXyz)\n' +
            '➤ Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.\n' +
            `\n` +
            global.msg.footer
        );
    }
};