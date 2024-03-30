const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'ghdl',
    aliases: ['github', 'gitclone', 'githubdl'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
        if (!regex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const [user, repo] = input.match(regex) || [];
            const repoName = repo.replace(/.git$/, '');
            const url = createAPIUrl('https://api.github.com', `/repos/${user}/${repoName}/zipball`, {});
            const response = await fetch(url, {
                method: 'HEAD'
            });
            const fileName = response.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];

            await ctx.reply({
                document: {
                    url: fileName
                },
                mimetype: 'application/zip'
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};