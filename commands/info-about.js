const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'about',
    category: 'info',
    code: async (ctx) => {
        const readmore = '\u200E'.repeat(4001);

        return ctx.reply(
            `Halo! Saya Rei Ayanami, bot WhatsApp yang terinspirasi oleh karakter anime "Neon Genesis Evangelion". Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` +
            `${readmore}\n` +
            `Penafian: Rei Ayanami (bot WhatsApp) adalah proyek kreatif oleh Muhamad Ikbal Maulana dan bukan merupakan bagian resmi dari seri "Neon Genesis Evangelion" atau perusahaan terkait lainnya.`
        ); // Dapat diubah sesuai keinginan Anda
    }
};