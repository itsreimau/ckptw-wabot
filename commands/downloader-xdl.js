const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const twitterdown = require("nayan-media-downloader");

module.exports = {
    name: "xdl",
    aliases: ["twit", "twitdl", "twitterdl"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;
        if (!input) {
            return ctx.reply(
                `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
            );
        }

        const urlRegex = /((([A-Za-z]{39}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const result = await twitterdown(input);

            if (!result) return ctx.reply(global.msg.notFound);

            const videoUrl = result.data.HD || result.data.SD;

            return await ctx.reply({
                video: {
                    url: videoUrl,
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("Twitter")}\n` +
                    "\n" +
                    `➲ URL: ${input}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false,
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    },
};