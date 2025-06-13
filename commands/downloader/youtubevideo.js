const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "https://www.youtube.com/watch?v=hoKluzn07eQ -d"))}\n` +
            quote(tools.msg.generatesFlagInfo({
                "-d": "Kirim sebagai dokumen"
            }))
        );

        const flag = tools.cmd.parseFlag(input, {
            "-d": {
                type: "boolean",
                key: "document"
            }
        });

        const url = flag.input || null;

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("skyzopedia", "/download/ytdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            if (flag?.document) return await ctx.reply({
                document: {
                    url: result.mp4
                },
                fileName: `${result.title}.mp4`,
                mimetype: mime.lookup("mp4")
            });

            return await ctx.reply({
                video: {
                    url: result.mp4
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};