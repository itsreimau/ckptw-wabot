const {
    createAPIUrl
} = require("../tools/api.js");
const {
    mediafiredl
} = require("@bochilteam/scraper");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "mfdl",
    aliases: ["mf", "mediafire", "mediafiredl"],
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            let result;

            const apiCalls = [
                () => axios.get(createAPIUrl("ngodingaja", "/api/mediafire", {
                    url: input
                })).then(response => response.hasil.url),
                () => axios.get(createAPIUrl("ssa", "/api/mediafire", {
                    url: input
                })).then(response => response.data.data.response.link),
                () => mediafiredl(input).then(response => response.data.url || response.data.url2)
            ];

            for (const call of apiCalls) {
                try {
                    result = await call();
                    if (result) break;
                } catch (error) {
                    console.error("Error in API call:", error);
                }
            }

            return ctx.reply({
                document: {
                    url: result
                },
                mimetype: mime.lookup(result) || "application/octet-stream"
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};