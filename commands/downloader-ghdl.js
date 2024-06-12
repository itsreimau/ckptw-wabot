const {
    createAPIUrl
} = require("./api.js");
const axios = require("axios");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "ghdl",
    aliases: ["github", "gitclone"],
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://github.com/itsreimau/ckptw-wabot`)}`
        );

        try {
            const urlRegex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            const [_, user, repo] = input.match(urlRegex) || [];
            const repoName = repo.replace(/.git$/, "");
            const apiUrl = createAPIUrl("https://api.github.com", `/repos/${owner}/${repo}/zipball/master`, {});

            const response = await axios({
                method: "GET",
                url: apiUrl,
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Node.js",
                },
            });

            if (response.status !== 200) throw new Error(global.msg.notFound);

            return ctx.reply({
                document: response.data,
                mimetype: mime.contentType("zip")
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};