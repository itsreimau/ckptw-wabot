const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/igdl", {
                url
            });
            const result = (await axios.get(apiUrl)).data.data;

            for (const media of result) {
                const isImage = media.type === "image";
                const mediaType = isImage ? "image" : "video";
                const extension = isImage ? "jpg" : "mp4";

                await ctx.reply({
                    [mediaType]: {
                        url: media.url
                    },
                    mimetype: mime.lookup(extension)
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};