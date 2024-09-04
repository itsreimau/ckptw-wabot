const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    translate
} = require("bing-translate-api");
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
            const mangaApiUrl = await global.tools.api.createUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const mangaResponse = await fetch(mangaApiUrl);
            const mangaData = await mangaResponse.json();

            if (!mangaData.data || mangaData.data.length === 0) return ctx.reply(global.msg.notFound);

            const info = mangaData.data[0];
            const synopsisId = info.synopsis ? await translate(info.synopsis, "en", "id").then(res => res.translation) : null;

            return await ctx.reply(
                `${quote(`Judul: ${info.title}`)}\n` +
                `${quote(`Judul (Inggris): ${info.title_english || "N/A"}`)}\n` +
                `${quote(`Judul (Jepang): ${info.title_japanese || "N/A"}`)}\n` +
                `${quote(`Tipe: ${info.type || "N/A"}`)}\n` +
                `${quote(`Bab: ${info.chapters || "N/A"}`)}\n` +
                `${quote(`Volume: ${info.volumes || "N/A"}`)}\n` +
                `${quote(`Ringkasan: ${synopsisId ? synopsisId.replace("\n\n", ". ") : "N/A"}`)}\n` +
                `${quote(`URL: ${info.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};