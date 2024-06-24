const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "about",
    category: "info",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        return ctx.reply(
            `❖ ${bold("About")}\n` +
            "\n" +
            `Halo! Saya adalah Bot WhatsApp bernama ${global.bot.name}, dimiliki oleh ${global.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`
        ); // Can be changed according to your wishes.
    }
};