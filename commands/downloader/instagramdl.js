const axios = require("axios");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://www.instagram.com/p/CXDjK3Kph8_"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/igdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            for (const media of result) {
                const isVideo = media.type === "video";
                const mediaType = isVideo ? "video" : "image";
                const extension = isVideo ? "mp4" : "jpg";

                await ctx.reply({
                    [mediaType]: {
                        url: media.url
                    },
                    mimetype: tools.mime.lookup(extension)
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};