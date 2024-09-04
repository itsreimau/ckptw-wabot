const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const fetch = require("node-fetch");

module.exports = {
    name: "ttsg",
    aliases: ["texttospeechgoogle", "tts", "ttsgoogle"],
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

        let textToSpeech = ctx.args.join(" ") || null;
        let langCode = "id";

        if (ctx.quoted) {
            const quotedMessage = ctx.quoted;
            textToSpeech = Object.values(quotedMessage).find(msg => msg.caption || msg.text)?.caption || textToSpeech || null;

            if (ctx.args[0] && ctx.args[0].length === 2) langCode = ctx.args[0];
        } else {
            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToSpeech = textToSpeech ? textToSpeech : ctx.args.slice(1).join(" ");
            }
        }

        if (!textToSpeech) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo!`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("fasturl", "/tool/tts/google", {
                text: textToSpeech,
                speaker: langCode
            });
            const response = await fetch(apiUrl, {
                headers: {
                    "x-api-key": global.tools.api.listAPIUrl().fasturl.APIKey
                }
            });
            const data = await response.buffer();

            return await ctx.reply({
                audio: data,
                mimetype: mime.contentType("mp3"),
                ptt: true
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};