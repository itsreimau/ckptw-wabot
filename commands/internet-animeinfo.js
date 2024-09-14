const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "animeinfo",
    aliases: ["anime"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            energy: 10,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "neon genesis evangelion"))
        );

        try {
            const animeApiUrl = await global.tools.api.createUrl("https://api.jikan.moe", "/v4/anime", {
                q: input
            });
            const animeResponse = await axios.get(animeApiUrl);
            const info = animeResponse.data.data[0];

            const translationApiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: info.synopsis,
                target: "id"
            });
            const translationResponse = await axios.get(translationApiUrl, {
                headers: {
                    "x-api-key": global.tools.listAPIUrl().fasturl.APIKey
                }
            });
            const synopsisId = translationResponse.data.translatedText || info.synopsis;

            return await ctx.reply(
                `${quote(`Judul: ${info.title}`)}\n` +
                `${quote(`Judul (Inggris): ${info.title_english}`)}\n` +
                `${quote(`Judul (Jepang): ${info.title_japanese}`)}\n` +
                `${quote(`Tipe: ${info.type}`)}\n` +
                `${quote(`Episode: ${info.episodes}`)}\n` +
                `${quote(`Durasi: ${info.duration}`)}\n` +
                `${quote(`Ringkasan: ${synopsisId.replace("\n\n", ". ")}`)}\n` +
                `${quote(`URL: ${info.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};