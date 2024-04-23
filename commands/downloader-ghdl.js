const {
    ghdl
} = require('../lib/scraper.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'ghdl',
    aliases: ['github', 'gitclone'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://github.com/itsreimau/ckptw-wabot`)}`
        );

        try {
            const urlRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            const [_, user, repo] = input.match(urlRegex) || [];
            const repoName = repo.replace(/.git$/, '');
            const result = await ghdl(user, repoName);

            if (!result) throw new Error(global.msg.notFound);

            return ctx.reply({
                document: result,
                mimetype: 'application/zip'
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};