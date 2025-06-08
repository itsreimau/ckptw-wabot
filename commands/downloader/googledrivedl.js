const {
    quote
} = require("@itsreimau/ckptw-mod");
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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.cmd.isUrl(url);
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
                fileName: result.name,
                mimetype: mime.lookup(result.name) || "application/octet-stream",
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};