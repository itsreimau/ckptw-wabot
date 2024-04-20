require('./config.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'sc',
    aliases: ['script', 'source', 'sourcecode'],
    category: 'info',
    code: async (ctx) => {
        const apiUrl = await createAPIUrl('https://api.github.com', '/repos/itsreimau/ckptw-wabot', {});
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data) return ctx.reply(global.msg.notFound);

        const repo = data.items[0];
        return ctx.reply(
            `❖ ${bold('SC')}\n` +
            `\n` +
            `• Nama: ${repo.name}\n` +
            `• Deskripsi: ${repo.description}\n` +
            `• Owner: ${repo.owner.login}\n` +
            `• Dibuat: ${formatDate(repo.created_at)}\n` +
            `• Bahasa: ${repo.language}\n` +
            `• Lisensi: ${repo.license.name}\n` +
            `\n` +
            global.msg.footer
        )
    }
};