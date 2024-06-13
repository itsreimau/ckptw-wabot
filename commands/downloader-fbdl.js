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
const axios = require("axios");
const fg = require("api-dylux");
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

            const promises = [
                axios.get(createAPIUrl("nyxs", "/dl/fb", {
                    url: input
                })).then((response) => ({
                    source: "nyxs",
                    data: response.data
                })),
                axios.get(createAPIUrl("ngodingaja", "/api/fb", {
                    url: input
                })).then((response) => ({
                    source: "ngodingaja",
                    data: response.data
                })),
                getFBInfo(input).then((data) => ({
                    source: "getFBInfo",
                    data
                })),
                fg.fbdl(input).then((data) => ({
                    source: "fg",
                    data
                })),
                facebookdl(input).then((data) => ({
                    source: "facebookdl",
                    data
                })),
                facebookdlv2(input).then((data) => ({
                    source: "facebookdlv2",
                    data
                }))
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === "fulfilled" && res.value) {
                    switch (res.value.source) {
                        case "nyxs":
                            result = res.value.data.result.HD || res.value.data.result.SD;
                            break;
                        case "ngodingaja":
                            result = res.value.data.hasil.url;
                            break;
                        case "getFBInfo":
                            result = res.value.data.videoUrl;
                            break;
                        case "fg":
                            result = res.value.data.hd || res.value.data.sd;
                            break;
                        case "facebookdl":
                            result = res.value.data.videoUrl;
                            break;
                        case "facebookdlv2":
                            result = res.value.data.videoUrl;
                            break;
                    }
                    if (result) break;
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