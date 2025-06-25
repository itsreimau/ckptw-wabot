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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://github.com/itsreimau/gaxtawu"))
        );

        const isUrl = await tools.cmd.isUrl(url);
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
                fileName: result.filename,
                mimetype: mime.lookup(result.filename) || "application/octet-stream",
                caption: `${formatter.quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};