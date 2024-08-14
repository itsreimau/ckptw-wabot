const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "info",
    code: async (ctx) => {
        return ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("JastinXyz (https://github.com/JastinXyz)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            global.msg.footer
        );
    }
};