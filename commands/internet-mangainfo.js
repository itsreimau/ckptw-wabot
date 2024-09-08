const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    translate
} = require("bing-translate-api");

module.exports = {
    name: "mangainfo",
    aliases: ["manga"],
    category: "internet",
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`)
        );

        try {
            const mangaApiUrl = await global.tools.api.createUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const mangaResponse = await axios.get(mangaApiUrl);
            const mangaData = mangaResponse.data;

            if (!mangaData.data || mangaData.data.length === 0) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);

            const info = mangaData.data[0];
            const synopsisId = info.synopsis ? await translate(info.synopsis, "en", "id").then(res => res.translation) : null;

            return await ctx.reply(
                `${quote(`${await global.tools.msg.translate("Judul", userLanguage)}: ${animeInfo.title}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Judul (Inggris)", userLanguage)}: ${animeInfo.title_english || "N/A"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Judul (Jepang)", userLanguage)}: ${animeInfo.title_japanese || "N/A"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Tipe", userLanguage)}: ${animeInfo.type || "N/A"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Bab", userLanguage)}: ${info.chapters || "N/A"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Volume", userLanguage)}: ${info.volumes || "N/A"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Ringkasan", userLanguage)}: ${synopsisId ? synopsisId.replace("\n\n", ". ") : "N/A"}`)}\n` +
                `${quote(`URL: ${animeInfo.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};