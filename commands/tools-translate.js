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
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

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
            textToTranslate = Object.values(quotedMessage).find(msg => msg.caption || msg.text)?.caption || textToTranslate || null;

            if (ctx.args[0] && ctx.args[0].length === 2) langCode = ctx.args[0];
        } else {
            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToTranslate = textToTranslate ? textToTranslate : ctx.args.slice(1).join(" ");
            }
        }

        if (!textToTranslate) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo!`)}`)
        );

        try {
            const {
                translation
            } = await translate(textToTranslate, null, langCode);

            return ctx.reply(translation);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};