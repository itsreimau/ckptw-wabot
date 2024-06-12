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

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            let result;

            const promises = [
                axios.get(createAPIUrl("ssa", "/api/mediafire", {
                    url: input
                })).then((response) => ({
                    source: "ssa",
                    data: response.data
                })),
                mediafiredl(input).then((response) => ({
                    source: "mediafiredl",
                    data: response.data
                }))
            ];

            const results = await Promise.allSettled(promises);

            for (const res of results) {
                if (res.status === "fulfilled" && res.value) {
                    switch (res.value.source) {
                        case "ssa":
                            result = res.value.data.data.response.link;
                            break;
                        case "mediafiredl":
                            result = res.value.data.url; || res.value.data.url2;
                            break;
                    }
                    if (result) break;
                }
            }

            if (!result) throw new Error(global.msg.notFound);

            return ctx.reply({
                document: {
                    url: result
                },
                mimetype: mime.lookup(result) || "application/octet-stream"
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};