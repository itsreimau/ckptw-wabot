const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "githubdl",
    aliases: ["ghdl", "gitclone"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("diibot", "/api/download/gitclone", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                document: {
                    url: result.urllink
                },
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer,
                fileName: result.filename,
                mimetype: mime.lookup(result.filename) || "application/octet-stream"
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};