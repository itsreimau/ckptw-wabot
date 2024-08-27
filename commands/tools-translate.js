const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    translate
} = require("bing-translate-api");

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

        let textToTranslate = ctx.args.join(" ");
        let langCode = "id";

        if (ctx.quoted) {
            const quotedMessage = ctx.quoted;
            textToTranslate = Object.values(quotedMessage).find(
                msg => msg.caption || msg.text
            )?.caption || textToTranslate || null;
        }

        if (ctx.args[0] && ctx.args[0].length === 2) {
            langCode = ctx.args[0];
            textToTranslate = textToTranslate ? textToTranslate : ctx.args.slice(1).join(" ");
        }

        if (!textToTranslate) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo!`)}`)
        );

        try {
            const {
                translation
            } = await translate(textToTranslate, null, langCode);

            return ctx.reply(translation);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Error: ${error.message}`));
        }
    }
};