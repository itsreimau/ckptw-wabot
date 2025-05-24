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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/ -d"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
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

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("zell", "/download/youtube", {
                url,
                format: "360"
            });
            const result = (await axios.get(apiUrl)).data;

            if (flag?.document) return await ctx.reply({
                document: {
                    url: result
                },
                fileName: `${result.title}.mp4`,
                mimetype: mime.lookup("mp4")
            });

            return await ctx.reply({
                video: {
                    url: result.download
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};