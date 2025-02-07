const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "instagramstoriesdl",
    aliases: ["igstories", "igstoriesdl", "instagramstories"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "itsreimau"))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/download/igs", {
                username: input
            });
            const {
                data
            } = await axios.get(apiUrl);
            const result = Array.from(new Map(data.BK9.map(media => [media.url, media])).values());

            for (const media of result) {
                const isImage = media.type === "image";
                const mediaType = isImage ? "image" : "video";
                const extension = isImage ? "png" : "mp4";

                await ctx.reply({
                    [mediaType]: {
                        url: media.url
                    },
                    mimetype: mime.lookup(extension)
                });
            }
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};