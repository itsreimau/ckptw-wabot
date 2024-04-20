const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const mime = require('mime-types');

module.exports = {
    name: 'ghdl',
    aliases: ['github', 'gitclone'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const [_, user, repo] = input.match(urlRegex) || [];
            const repoName = repo.replace(/.git$/, '');
            const apiUrl = createAPIUrl('https://api.github.com', `/repos/${user}/${repoName}/zipball`, {});
            const response = await fetch(apiUrl, {
                method: 'HEAD'
            });
            const file = response.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];
            const mimeType = mime.lookup(file);

            return ctx.reply({
                document: file,
                mimetype: mimeType
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};