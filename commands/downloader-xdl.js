const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    twitterdown
} = require("nayan-media-downloader")

module.exports = {
    name: "xdl",
    aliases: ["twit", "twitdl", "twitdl", "twitterdl"],
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");
        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const result = await twitterdown(input)

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result.data.HD || result.data.SD
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("Twitter Downloader")}\n` +
                    `➲ URL: ${input}\n` +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};