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
    name: "tts",
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

        if (!ctx.args.length && !ctx.quoted) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} id halo!`)}`)
        );

        let langCode = "id";
        let textToTranslate = ctx.args.join(" ");

        if (ctx.args[0] && ctx.args[0].length === 2) {
            langCode = ctx.args[0];
            textToTranslate = ctx.args.slice(1).join(" ");
        }
        if (!textToTranslate && ctx.quoted) textToTranslate = ctx.quoted.conversation;

        try {
            const apiUrl = createAPIUrl("nyxs", "/tools/tts", {
                text: textToSpeech,
                to: langCode
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                audio: {
                    url: data.result,
                },
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};