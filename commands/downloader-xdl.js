const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

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
            const sources = ["nyxs", "ngodingaja", "ssa"];
            let result;

            for (const source of sources) {
                result = await xdl(source, input);
                if (result) break;
            } catch (error) {
                console.error(`Error from ${source}:`, error);
                continue;
            }

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.contentType("mp4"),
                caption: `❖ ${bold("Twitter Downloader")}\n` +
                    `➲ URL: ${input}\n` +
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

async function xdl(source, url) {
    let result = null;

    switch (source) {
        case "nyxs":
            result = await axios.get(createAPIUrl("nyxs", "/dl/twitter", {
                url
            })).then(response => response.data.result.media[0].videos[0].url);
            break;
        case "ngodingaja":
            result = await axios.get(createAPIUrl("ngodingaja", "/api/twitter", {
                url
            })).then(response => response.data.hasil.HD || response.data.hasil.SD);
            break;
        case "ssa":
            result = await axios.get(createAPIUrl("ssa", "/api/twitter", {
                url
            })).then(response => response.data.data.response.video_hd || response.data.data.response.video_sd);
            break;
        default:
            throw new Error(`Unsupported source: ${source}`);
    }

    return result;
}