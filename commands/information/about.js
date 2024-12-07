const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "about",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(
            quote(`👋 Halo! Saya adalah Bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)
        ); // Dapat diubah sesuai keinginan Anda
    }
};