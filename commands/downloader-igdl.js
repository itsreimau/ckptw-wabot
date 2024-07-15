const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    ndown
} = require("nayan-media-downloader")

module.exports = {
    name: "igdl",
    aliases: ["ig", "instagram"],
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
            const result = await ndown(input);

            if (!result) return ctx.reply(global.msg.notFound);

            const videos = result.data[0].url;

            return await ctx.reply({
                video: {
                    videos,
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("IG Downloader")}\n` +
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
    }
};