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

        if (!ctx.args.length && !ctx.quoted) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} id halo!`)}`)
        );

        let langCode = "id";
        let textToTranslate = ctx.args.join(" ");

        if (ctx.args[0] && ctx.args[0].length === 2) {
            langCode = ctx.args[0];
            textToTranslate = ctx.args.slice(1).join(" ");
        }
        if (!textToTranslate && ctx.quoted) textToTranslate = ctx.quoted.conversation;

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