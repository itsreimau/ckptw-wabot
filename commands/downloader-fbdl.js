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
            const sources = ["nazunaxz", "nyxs", "ngodingaja", "xaviabot", "dylux", "bochilteam", "bochilteamv2"];
            let result;

            for (const source of sources) {
                result = await fbdl(source, input);
                if (result) break;
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

async function fbdl(source, url) {
    let result = null;

    switch (source) {
        case "nazunaxz":
            result = await axios.get(createAPIUrl("nazunaxz", "/api/downloader/facebook", {
                url
            })).then(response => response.data.data.media[0].url || response.data.data.media[1].url);
            break;
        case "nyxs":
            result = await axios.get(createAPIUrl("nyxs", "/dl/fb", {
                url
            })).then(response => response.data.result.HD || response.data.result.SD);
            break;
        case "ngodingaja":
            result = await axios.get(createAPIUrl("ngodingaja", "/api/fb", {
                url
            })).then(response => response.data.hasil.url);
            break;
        case "xaviabot":
            result = await getFBInfo(url).then(data => data.videoUrl);
            break;
        case "dylux":
            result = await fg.fbdl(url).then(data => data.hd || data.sd);
            break;
        case "bochilteam":
            result = await facebookdl(url).then(data => data.videoUrl);
            break;
        case "bochilteamv2":
            result = await facebookdlv2(url).then(data => data.videoUrl);
            break;
        default:
            throw new Error(`Unsupported source: ${source}`);
    }

    return result;
}