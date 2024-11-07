const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tts",
    aliases: ["texttospeechgoogle", "ttsgoogle"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        let textToSpeech = ctx.args.join(" ") || null;
        let langCode = "id";

        if (tools.general.checkQuotedMedia(ctx.quoted, "text")) {
            const quotedMessage = ctx.quoted;

            if (quotedMessage.conversation) {
                textToSpeech = quotedMessage.conversation;
            } else {
                textToSpeech = Object.values(quotedMessage).find(msg => msg?.caption || msg?.text)?.caption || quotedMessage?.extendedTextMessage?.text || textToSpeech || null;
            }

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

        if (!textToSpeech) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "en halo dunia!"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("tts");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("nyxs", "tools/tts", {
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
                mimetype: mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};