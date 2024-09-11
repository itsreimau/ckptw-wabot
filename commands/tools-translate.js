const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "global.tools",
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

        if (ctx.quoted.toBuffer()) {
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
            const apiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: textToTranslate,
                target: langCode
            });
            const {
                data
            } = await axios.get(apiUrl, {
                headers: {
                    "x-api-key": global.tools.listAPIUrl().fasturl.APIKey
                }
            });

            return ctx.reply(data.translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};