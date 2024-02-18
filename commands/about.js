const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'about',
    category: 'info',
    code: async (ctx) => {
        const readmore = '\u200E'.repeat(4001);

        return ctx.reply(
            `Halo! Saya adalah Rei Ayanami, bot WhatsApp yang terinspirasi oleh karakter anime "Neon Genesis Evangelion". Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya hadir untuk menghibur dan membuat Anda senang! 😊\n` +
            `${readmore}\n` +
            `Penafian: Bot Rei Ayanami adalah proyek kreatif oleh Muhamad Ikbal Maulana dan bukan bagian resmi dari serial "Neon Genesis Evangelion" atau perusahaan terkait.`
        );
    }
};