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

            return ctx.reply(data.items.map((repo, index) =>
                `• ${1 + index}. ${repo.full_name} ${repo.fork ? ' (fork)' : ''}\n` +
                `• URL: ${repo.html_url}\n` +
                `• Dibuat pada ${formatDate(repo.created_at)}\n` +
                `• Pembaruan terakhir pada ${formatDate(repo.updated_at)}\n` +
                `• Pengamat: ${repo.watchers}\n` +
                `• Garpu: ${repo.forks}\n` +
                `• Jumlah pengamat bintang: ${repo.stargazers_count}\n` +
                `• Isu terbuka: ${repo.open_issues}\n` +
                `• Deskripsi: ${repo.description}\n` +
                `• Klon: ${monospace(`$ git clone ${repo.clone_url}`)}`
                .trim()).join('\n----\n'))
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