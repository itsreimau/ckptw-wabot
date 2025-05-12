const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "googledrivedl",
    aliases: ["drivedl", "gd", "gddl", "gdrive", "gdrivedl", "googledrive", "googledrivedl"],
    category: "downloader",
    permissions: {
        premium: true
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
            const apiUrl = tools.api.createUrl("agatz", "/api/drivedl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply({
                document: {
                    url: result.download
                },
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer,
                fileName: result.name,
                mimetype: mime.lookup(result.name) || "application/octet-stream"
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};