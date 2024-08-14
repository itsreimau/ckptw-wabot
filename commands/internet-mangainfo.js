const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    translate
} = require("bing-translate-api");
const mime = require("mime-types");

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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const {
                data
            } = await axios.get(apiUrl);
            const info = data.data[0];
            const synopsisId = info.synopsis ? await translate(info.synopsis, "en", "id") : null;

            return await ctx.reply(
                `${quote(`Judul: ${info.title}`)}\n` +
                `${quote(`Judul (Inggris): ${info.title_english}`)}\n` +
                `${quote(`Judul (Jepang): ${info.title_japanese}`)}\n` +
                `${quote(`Tipe: ${info.type}`)}\n` +
                `${quote(`Bab: ${info.chapters}`)}\n` +
                `${quote(`Volume: ${info.volumes}`)}\n` +
                `${quote(`Ringkasan: ${synopsisId.translation}`)}\n` +
                `${quote(`URL: ${info.url}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};