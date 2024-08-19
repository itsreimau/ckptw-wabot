const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "fbdl",
    aliases: ["fb", "facebook"],
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


        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            let result = null;

            const apiCalls = [
                async () => {
                        const {
                            data
                        } = await axios.get(createAPIUrl("agatz", "/api/facebook", {
                            url
                        }));
                        return data.hasil.url || data.high || data.low;
                    },
                    async () => {
                            const {
                                data
                            } = await axios.get(createAPIUrl("nyxs", "/dl/fb", {
                                url
                            }));
                            return data.result.HD || data.result.SD;
                        },
                        async () => {
                            const {
                                data
                            } = await axios.get(createAPIUrl("ngodingaja", "/api/fb", {
                                url
                            }));
                            return data.hasil.url;
                        }
            ];

            for (const call of apiCalls) {
                try {
                    result = await call();
                    if (result && urlRegex.test(result)) break;
                } catch (error) {
                    console.error("Error in API call:", error.message);
                }
            }

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.contentType("mp4"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};