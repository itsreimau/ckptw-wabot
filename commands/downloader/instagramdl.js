const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/instagram", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (data.url_list && data.url_list.length > 0) {
                for (const mediaUrl of data.url_list) {
                    if (mediaUrl.includes(".mp4")) {
                        await ctx.reply({
                            video: {
                                url: mediaUrl
                            },
                            mimetype: mime.contentType("mp4")
                        });
                    } else {
                        await ctx.reply({
                            image: {
                                url: mediaUrl
                            },
                            mimetype: mime.contentType("jpg")
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};