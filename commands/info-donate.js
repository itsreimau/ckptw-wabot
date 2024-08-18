const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "info",
    code: async (ctx) => {
        return ctx.reply(
            `${quote("083838039693 (DANA)")}\n` +
            `${quote("─────")}\n` +
            `${quote("https://paypal.me/itsreimau (PayPal)")}\n` +
            `${quote("https://saweria.co/itsreimau (Saweria)")}\n` +
            `${quote("https://trakteer.id/itsreimau (Trakteer)")}\n` +
            "\n" +
            global.msg.footer
        );
    }
};