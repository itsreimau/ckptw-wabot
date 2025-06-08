const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "videydl",
    aliases: ["videy"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const id = new URL(url).searchParams.get("id");
            const result = `https://cdn.videy.co/${id}.mp4`;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("mp4"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};