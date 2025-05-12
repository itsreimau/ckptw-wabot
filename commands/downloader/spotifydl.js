const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "spotifydl",
    aliases: ["spotidl"],
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
            const apiUrl = tools.api.createUrl("fasturl", "/downup/spotifydown", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result.metadata.link;

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: mime.lookup("mp3"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};