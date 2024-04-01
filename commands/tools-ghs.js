const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'ghs',
    aliases: ['githubsearch'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ckptw-wabot`)}`
        );

        try {
            const apiUrl = await createAPIUrl('https://api.github.com', '/search/repositories', {
                q: input
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data) return ctx.reply(global.msg.notFound);

            const repo = data.items[0];
            return ctx.reply(
                `❖ ${bold('GitHub Search')}\n` +
                `\n` +
                `• Nama: ${repo.name}\n` +
                `• Privasi: ${repo.private}\n` +
                `• Owner: ${repo.owner.login}\n` +
                `• Deskripsi: ${repo.description}\n` +
                `• Dibuat: ${formatDate(repo.created_at)}\n` +
                `• Pembaruan: ${formatDate(repo.updated_at)}\n` +
                `• Ukuran: ${repo.size}\n` +
                `• Jumlah pengamat bintang: ${repo.stargazers_count}\n` +
                `• Jumlah pengamat: ${repo.watchers_count}\n` +
                `• Bahasa: ${repo.language}\n` +
                `• Garpu: ${repo.forks_count}\n` +
                `• Isu terbuka: ${repo.open_issues_count}\n` +
                `\n` +
                global.msg.footer
            )
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function formatDate(n, locale = 'id') {
    const dt = new Date(n)
    return dt.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}