const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
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

        const [lang, ...text] = ctx._args;
        const langCode = lang.length === 2 ? lang : "id";
        const textToSpeech = text.length ? text.join(" ") : ctx._args.join(" ");

        if (!ctx._args.length) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} id halo!`)}`)
        );

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