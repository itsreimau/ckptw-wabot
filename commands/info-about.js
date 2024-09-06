const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "about",
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        return ctx.reply(await global.tools.msg.translate(`Halo! Saya adalah Bot WhatsApp bernama ${global.bot.name}, dimiliki oleh ${global.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`, userLanguage)); // Can be changed according to your wishes.
    }
};