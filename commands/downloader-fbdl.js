const {
    createAPIUrl
} = require("../tools/api.js");
const {
    facebookdl,
    facebookdlv2
} = require("@bochilteam/scraper");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const getFBInfo = require("@xaviabot/fb-downloader");
const fg = require("api-dylux");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "fbdl",
    aliases: ["fb", "facebook"],
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
            let result;

            const apiCalls = [
                () => axios.get(createAPIUrl("nazunaxz", "/api/downloader/facebook", {
                    url: input
                })).then(response => response.data.data.media[0].url || response.data.data.media[1].url),
                () => axios.get(createAPIUrl("nyxs", "/dl/fb", {
                    url: input
                })).then(response => response.data.result.HD || response.data.result.SD),
                () => axios.get(createAPIUrl("ngodingaja", "/api/fb", {
                    url: input
                })).then(response => response.data.hasil.url),
                () => getFBInfo(input).then(data => data.videoUrl),
                () => fg.fbdl(input).then(data => data.hd || data.sd),
                () => facebookdl(input).then(data => data.videoUrl),
                () => facebookdlv2(input).then(data => data.videoUrl)
            ];

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
                    url: result,
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("FB Downloader")}\n` +
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