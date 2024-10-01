const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ttsg",
    aliases: ["texttospeechgoogle", "tts", "ttsgoogle"],
    category: "web_tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            coin: [5, "text", 1]
        });
        if (status) return ctx.reply(message);

        let textToSpeech = ctx.args.join(" ") || null;
        let langCode = "id";

        if (ctx.quoted.caption || ctx.quoted.text) {
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
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "en halo dunia!"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("fasturl", "/tool/tts/google", {
                text: textToSpeech,
                speaker: langCode
            });
            const {
                data
            } = await axios.get(apiUrl, {
                headers: {
                    "x-api-key": global.tools.listAPIUrl().fasturl.APIKey
                },
                responseType: "arraybuffer"
            });

            return await ctx.reply({
                audio: data,
                mimetype: mime.contentType("mp3"),
                ptt: true
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};