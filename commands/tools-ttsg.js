const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ttsg",
    aliases: ["texttospeechgoogle", "tts", "ttsgoogle"],
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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo!`)}`)
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
                    "x-api-key": global.tools.api.listUrl().fasturl.APIKey
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
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};