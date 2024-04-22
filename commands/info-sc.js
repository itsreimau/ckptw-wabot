const {
    createAPIUrl
} = require('../lib/api.js');
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

        if (!response.ok) throw new Error(global.msg.notFound);

        const data = await response.json();

        return ctx.reply(
            `❖ ${bold('SC')}\n` +
            '\n' +
            `➤ Nama: ${data.name}\n` +
            `➤ URL: ${data.html_url}\n` +
            `➤ Deskripsi: ${data.description}\n` +
            `➤ Owner: ${data.owner.login}\n` +
            `➤ Dibuat: ${formatDate(data.created_at)}\n` +
            `➤ Bahasa: ${data.language}\n` +
            `➤ Lisensi: ${data.license.name}\n` +
            '\n' +
            global.msg.footer
        )
    }
};

function formatDate(date, locale = 'id') {
    const dt = new Date(date);
    return dt.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}