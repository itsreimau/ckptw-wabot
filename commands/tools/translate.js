const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        let textToTranslate = ctx.args.join(" ") || null;
        let langCode = "id";

        if (global.tools.general.checkQuotedMedia(ctx.quoted, "text")) {
            const quotedMessage = ctx.quoted;

            if (quotedMessage.conversation) {
                textToTranslate = quotedMessage.conversation;
            } else {
                textToTranslate = Object.values(quotedMessage).find(msg => msg?.caption || msg?.text)?.caption || quotedMessage?.extendedTextMessage?.text || textToTranslate || null;
            }

            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToTranslate = ctx.args.slice(1).join(" ") || textToTranslate;
            }
        } else {
            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToTranslate = ctx.args.slice(1).join(" ");
            } else {
                textToTranslate = ctx.args.join(" ");
            }
        }

        if (!textToTranslate) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "en halo dunia!"))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("translate");
            return ctx.reply(listText);
        }

        try {
            const translation = await global.tools.general.translate(textToTranslate, langCode);

            return ctx.reply(translation);
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};