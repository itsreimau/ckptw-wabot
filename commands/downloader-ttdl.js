const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const fg = require("api-dylux");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ttdl",
    aliases: ["tiktokdl", "tiktokmp3", "tiktoknowm", "tt", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vt", "vta", "vtaudio", "vtdltiktok", "vtmp3", "vtmusic", "vtmusik", "vtnowm"],
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
            const mp3cmd = ["tiktokmp3", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vta", "vtaudio", "vtmp3", "vtmusic", "vtmusik"];

            const apiCalls = [
                () => axios.get(createAPIUrl("nyxs", "/dl/tiktok", {
                    url: input
                }))
                .then(response => mp3cmd.includes(ctx._used.command) ?
                    response.data.result?.musik :
                    response.data.result?.video_hd),
                () => axios.get(createAPIUrl("ngodingaja", "/api/tiktok", {
                    url: input
                }))
                .then(response => mp3cmd.includes(ctx._used.command) ?
                    response.data.hasil?.musik :
                    response.data.result?.video2 || response.data.result?.video1 || response.data.hasil?.tanpawm),
                () => fg.tiktok(input)
                .then(data => mp3cmd.includes(ctx._used.command) ?
                    data.play :
                    data.hdplay)
            ];

            let result;
            for (const call of apiCalls) {
                try {
                    result = await call();
                    if (result) break;
                } catch (error) {
                    console.error("Error in API call:", error);
                }
            }

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.contentType(mp3cmd.includes(ctx._used.command) ? "mp3" : "mp4"),
                caption: `❖ ${bold("TT Downloader")}\n` +
                    "\n" +
                    `➲ URL: ${input}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};