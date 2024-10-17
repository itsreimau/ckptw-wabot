const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "pixeldraindl",
    aliases: ["pd", "pddl", "pixeldrain"],
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
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return await ctx.reply(global.config.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/pixeldrain", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply({
                document: {
                    url: data.download
                },
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.config.msg.footer,
                fileName: data.name,
                mimetype: data.mime_type || "application/octet-stream"
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};