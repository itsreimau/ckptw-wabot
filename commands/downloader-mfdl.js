const {
    createAPIUrl
} = require("../tools/api.js");
const {
    mediafiredl
} = require("@bochilteam/scraper");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "mfdl",
    aliases: ["mf", "mediafire", "mediafiredl"],
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

        const url = ctx._args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            let result;

            const apiCalls = [
                () => axios.get(createAPIUrl("ngodingaja", "/api/mediafire", {
                    url: url
                })).then(response => response.hasil.url),
                () => axios.get(createAPIUrl("ssa", "/api/mediafire", {
                    url: url
                })).then(response => response.data.data.response.link),
                () => mediafiredl(url).then(response => response.data.url || response.data.url2)
            ];

            for (const call of apiCalls) {
                try {
                    result = await call();
                    if (result) break;
                } catch (error) {
                    console.error("Error in API call:", error);
                }
            }

            const url = new URL(url);
            const filePath = url.pathname;
            const filename = filePath.substring(filePath.lastIndexOf('/') + 1);

            return ctx.reply({
                document: {
                    url: result
                },
                filename,
                mimetype: mime.lookup(result) || "application/octet-stream"
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};