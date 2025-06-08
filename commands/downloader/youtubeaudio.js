const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubeaudio",
    aliases: ["yta", "ytaudio", "ytmp3"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/ -d"))}\n` +
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

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/yt/yttomp4", {
                url
            });
            const result = (await axios.get(apiUrl)).data;

            if (flag?.document) return await ctx.reply({
                document: {
                    url: result.audio[0].url
                },
                fileName: `${result.title}.mp3`,
                mimetype: mime.lookup("mp3")
            });

            return await ctx.reply({
                audio: {
                    url: result.audio[0].url
                },
                mimetype: mime.lookup("mp3")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};