const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "vddl",
    aliases: ["vd", "videy", "videydl"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1],
        premium: true
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /^(https?:\/\/)?(www\.)?videy\.co\/v\?id=([a-zA-Z0-9]+)/i;
        const match = urlRegex.exec(url);
        if (!match) return ctx.reply(global.config.msg.urlInvalid);

        try {
            const videoId = match[3];
            const videoUrl = `https://cdn.videy.co/${videoId}.mp4`;

            return await ctx.reply({
                video: {
                    url: videoUrl
                },
                mimetype: mime.contentType("mp4"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.config.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};