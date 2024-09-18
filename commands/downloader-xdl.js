const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "xdl",
    aliases: ["twit", "twitdl", "twitter", "twitterdl", "x"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: 5
        });
        if (status) return ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.config.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/twitter", {
                url
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            return await ctx.reply({
                video: {
                    url: data.video_hd || data.video_sd
                },
                mimetype: mime.contentType("mp4"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.config.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};