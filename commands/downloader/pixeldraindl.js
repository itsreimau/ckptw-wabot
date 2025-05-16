const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "pixeldraindl",
    aliases: ["pd", "pddl", "pixeldrain"],
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
            const apiUrl = tools.api.createUrl("agatz", "/api/pixeldrain", {
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
                mimetype: result.mime_type || "application/octet-stream"
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};