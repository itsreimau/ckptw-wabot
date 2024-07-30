const axios = require("axios");
const mime = require("mime-types");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ghdl",
    aliases: ["github", "gitclone"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://github.com/itsreimau/ckptw-wabot`)}`
        );

        const urlRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/([^\/:]+)/i;
        if (!input.match(urlRegex)) return ctx.reply(global.msg.urlInvalid);

        const [_, user, repo] = match;
        const repoName = repo.replace(/.git$/, "");
        const apiUrl = `https://api.github.com/repos/${user}/${repoName}/zipball/master`;

        try {
            const response = await axios({
                method: "GET",
                url: apiUrl,
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Node.js"
                }
            });

            return ctx.reply({
                document: response.data,
                mimetype: mime.contentType("zip"),
                fileName: `${repoName}-master.zip`
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 404) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};