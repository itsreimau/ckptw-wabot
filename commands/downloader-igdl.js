const {
    createAPIUrl
} = require("../tools/api.js");
const {
    instagramdl
} = require("@bochilteam/scraper");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

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
            const sources = ["nazunaxz", "nyxs", "ngodingaja", "miwudev"];
            let result;

            for (const source of sources) {
                result = await igdl(source, input);
                if (result) break;
            } catch (error) {
                console.error(`Error from ${source}:`, error);
                continue;
            }

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result,
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("IG Downloader")}\n` +
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

async function igdl(source, url) {
    let result = null;

    switch (source) {
        case "nazunaxz":
            result = await axios.get(createAPIUrl("nazunaxz", "/api/downloader/instagram", {
                url
            })).then(response => response.data.data.media[0]);
            break;
        case "nyxs":
            result = await axios.get(createAPIUrl("nyxs", "/dl/ig", {
                url
            })).then(response => response.data.result[0].url);
            break;
        case "ngodingaja":
            result = await axios.get(createAPIUrl("ngodingaja", "/api/ig", {
                url
            })).then(response => response.data.hasil.download_link);
            break;
        case "miwudev":
            result = await axios.get(createAPIUrl("miwudev", "/api/v1/igdl", {
                url
            })).then(response => response.data.url);
            break;
        default:
            throw new Error(`Unsupported source: ${source}`);
    }

    return result;
}