const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "sfiledl",
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/download/sfile", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                document: {
                    url: result.download.url
                },
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer,
                fileName: result.metadata.filename,
                mimetype: result.metadata.mimetype || "application/octet-stream"
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};