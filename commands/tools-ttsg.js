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
    name: "ttsg",
    aliases: ["tts", "ttsgoogle", "texttospeechgoogle"],
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
            textToSpeech = Object.values(quotedMessage).find(
                msg => msg.caption || msg.text
            )?.caption || textToSpeech || null;

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
            const apiUrl = createAPIUrl("fasturl", "/tool/tts/google", {
                text: textToSpeech,
                speaker: langCode
            });
            const {
                data
            } = await axios.get(apiUrl, {
                headers: {
                    "User-Agent": global.system.userAgent,
                    "x-api-key": listAPIUrl().fasturl.APIKey
                },
                responseType: "arraybuffer"
            });

            return await ctx.reply({
                audio: data,
                mimetype: mime.contentType("mp3"),
                ptt: true
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(⚠Terjadi kesalahan: $ {
                error.message
            }));
        }
    }
};