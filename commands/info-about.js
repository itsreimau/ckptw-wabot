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
            `Halo! Saya Rei Ayanami, bot WhatsApp yang terinspirasi oleh karakter anime 'Neon Genesis Evangelion'. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` +
            `${global.msg.readmore}\n` +
            quote('Penafian: Rei Ayanami (bot WhatsApp) adalah proyek kreatif oleh Muhamad Ikbal Maulana dan bukan merupakan bagian resmi dari seri "Neon Genesis Evangelion" atau perusahaan terkait lainnya.')
        ); // Can be changed according to your wishes.
    }
};