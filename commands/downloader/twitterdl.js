const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "twitterdl",
    aliases: ["twitter", "twit", "twitdl"],
    category: "downloader",
    handler: {
        premium: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("toxicdevil", "/downloader/twitter", {
                url
            }, null, ["url"]);
            const data = (await axios.get(apiUrl)).data.result;
            const mediaType = data.url.hd.includes("mp4") ? "video" : "image";
            const extension = data.url.hd.includes("mp4") ? "mp4" : "png";

            return await ctx.reply({
                [mediaType]: {
                    url: data.url.hd
                },
                mimetype: mime.lookup(extension)
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};