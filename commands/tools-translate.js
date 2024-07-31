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

        if (!text.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Example: ${monospace(`${ctx._used.prefix + ctx._used.command} en hello world!`)}`
        );

        try {
            const {
                translation
            } = await translate(text.join(" "), null, lang);

            return ctx.reply(translation);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Error: ${error.message}`);
        }
    }
};