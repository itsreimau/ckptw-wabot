const axios = require("axios");

module.exports = {
    name: "googledrivedl",
    aliases: ["gd", "gddl", "googledrive"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://drive.google.com/file/d/1LunbMSJNMtGnUpy9fJGx7bougiwAo23j/view?usp=drive_link"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/downloader/google-drive", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                document: Buffer.from(result.downloadUrl, "base64"),
                fileName: result.filename,
                mimetype: tools.mime.lookup(result.filename) || "application/octet-stream",
                caption: formatter.quote(`URL: ${url}`),
                footer: config.msg.footer,
                interactiveButtons: []
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};