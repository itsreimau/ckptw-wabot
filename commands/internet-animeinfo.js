const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    translate
} = require("bing-translate-api");
const fetch = require("node-fetch");

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
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`)
        );

        try {
            const animeApiUrl = await global.tools.api.createUrl("https://api.jikan.moe", "/v4/anime", {
                q: input
            });
            const animeResponse = await fetch(animeApiUrl);
            const animeData = await animeResponse.json();

            if (!animeData.data || animeData.data.length === 0) return ctx.reply(global.msg.notFound);

            const animeInfo = animeData.data[0];
            const synopsisId = animeInfo.synopsis ? await translate(animeInfo.synopsis, "en", "id").then(res => res.translation) : null;

            return await ctx.reply(
                `${quote(`Judul: ${animeInfo.title}`)}\n` +
                `${quote(`Judul (Inggris): ${animeInfo.title_english || "N/A"}`)}\n` +
                `${quote(`Judul (Jepang): ${animeInfo.title_japanese || "N/A"}`)}\n` +
                `${quote(`Tipe: ${animeInfo.type || "N/A"}`)}\n` +
                `${quote(`Episode: ${animeInfo.episodes || "N/A"}`)}\n` +
                `${quote(`Durasi: ${animeInfo.duration || "N/A"}`)}\n` +
                `${quote(`Ringkasan: ${synopsisId ? synopsisId.replace("\n\n", ". ") : "N/A"}`)}\n` +
                `${quote(`URL: ${animeInfo.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};