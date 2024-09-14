const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "fbdl",
    aliases: ["fb", "facebook", "facebookdl"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            energy: 10,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("vkrdownloader", "/server", {
                vkr: url
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;
            const downloadUrl = data.downloads.find(d => d.format_id === "hd")?.url || data.downloads.find(d => d.format_id === "sd")?.url;

            return await ctx.reply({
                video: {
                    url: downloadUrl
                },
                mimetype: mime.contentType("mp4"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};