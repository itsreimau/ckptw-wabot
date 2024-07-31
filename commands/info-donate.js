const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "info",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        return ctx.reply(
            `❖ ${bold("Donate")}\n` +
            "\n" +
            "➲ 083838039693 (DANA)\n" +
            "-----\n" +
            "➲ https://paypal.me/itsreimau (PayPal)\n" +
            "➲ https://saweria.co/itsreimau (Saweria)\n" +
            "➲ https://trakteer.id/itsreimau (Trakteer)\n" +
            "\n" +
            global.msg.footer
        );
    }
};