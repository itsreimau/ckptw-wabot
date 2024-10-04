const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tts",
    aliases: ["texttospeechgoogle", "ttsgoogle"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true,
            coin: [10, "text", 1]
        });
        if (status) return ctx.reply(message);

        let textToSpeech = ctx.args.join(" ") || null;
        let langCode = "id";

        if (global.tools.general.checkQuotedMedia(ctx.quoted, "text")) {
            const quotedMessage = ctx.quoted;
            textToSpeech = Object.values(quotedMessage).find(msg => msg.caption || msg.text)?.caption || textToSpeech || null;

            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToSpeech = ctx.args.slice(1).join(" ") || textToSpeech;
            }
        } else {
            if (ctx.args[0] && ctx.args[0].length === 2) {
                langCode = ctx.args[0];
                textToSpeech = ctx.args.slice(1).join(" ");
            } else {
                textToSpeech = ctx.args.join(" ");
            }
        }

        if (!textToSpeech) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "en halo dunia!"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("nyxs", "tools/tts", {
                text: textToSpeech,
                to: langCode
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                audio: {
                    url: data.result
                },
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