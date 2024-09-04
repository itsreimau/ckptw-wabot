const {
    createAPIUrl,
    listAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        let textToTranslate = ctx.args.join(" ") || null;
        let langCode = "id";

        if (ctx.quoted) {
            const quotedMessage = ctx.quoted;
            textToTranslate = Object.values(quotedMessage).find(
                msg => msg.caption || msg.text
            )?.caption || textToTranslate || null;

            if (ctx.args[0] && ctx.args[0].length === 2) langCode = ctx.args[0];
        } else {
            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToTranslate = textToTranslate ? textToTranslate : ctx.args.slice(1).join(" ");
            }
        }

        if (!textToTranslate) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo!`)}`)
        );

        try {
            const apiUrl = createAPIUrl("fasturl", "/tool/translate", {
                text: textToTranslate,
                target: langCode
            });
            const response = await fetch(apiUrl, {
                headers: {
                    "x-api-key": listAPIUrl().fasturl.APIKey
                }
            });
            const data = await response.json();

            return ctx.reply(data.translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};