const {
    createAPIUrl,
    listAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "mangainfo",
    aliases: ["manga"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`)
        );

        try {
            const mangaApiUrl = await createAPIUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const mangaResponse = await fetch(mangaApiUrl);
            const mangaData = await mangaResponse.json();
            const info = mangaData.data[0];

            const translationApiUrl = createAPIUrl("fasturl", "/tool/translate", {
                text: info.synopsis,
                target: "ids"
            });
            const translationResponse = await fetch(translationApiUrl, {
                headers: {
                    "x-api-key": listAPIUrl().fasturl.APIKey
                }
            });
            const translationData = await translationResponse.json();
            const synopsisId = translationData.translatedText || info.synopsis;

            return await ctx.reply(
                `${quote(`Judul: ${info.title}`)}\n` +
                `${quote(`Judul (Inggris): ${info.title_english}`)}\n` +
                `${quote(`Judul (Jepang): ${info.title_japanese}`)}\n` +
                `${quote(`Tipe: ${info.type}`)}\n` +
                `${quote(`Bab: ${info.chapters}`)}\n` +
                `${quote(`Volume: ${info.volumes}`)}\n` +
                `${quote(`Ringkasan: ${synopsisId.replace("\n\n", ". ")}`)}\n` +
                `${quote(`URL: ${info.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};
``
`

In the updated code, I replaced the `
axios` import with `
node - fetch` and used the `
fetch` function instead of `
axios.get` for making the API requests. I also removed the "User-Agent" headers from the requests since `
node - fetch` doesn't require them explicitly.