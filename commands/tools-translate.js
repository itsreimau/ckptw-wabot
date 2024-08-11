const {
    bold,
    monospace
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

        const [lang = "id", ...text] = ctx._args;
        const langCode = lang.length === 2 ? lang : "id";
        const textToTranslate = text.length ? text.join(" ") : ctx._args.join(" ");

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} id halo dunia!`)}`
        );

        try {
            const {
                translation
            } = await translate(textToTranslate, null, langCode);

            return ctx.reply(translation);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Error: ${error.message}`);
        }
    }
};