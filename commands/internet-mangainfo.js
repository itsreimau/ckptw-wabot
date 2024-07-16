const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
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
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const response = await axios.get(apiUrl);

            const data = await response.data;
            const info = data.data[0];
            const synopsisId = info.synopsis ? await translate(info.synopsis, "en", "id") : null;

            return await ctx.reply(
                `❖ ${bold("Manga Info")}\n` +
                "\n" +
                `➲ Judul: ${info.title}\n` +
                `➲ Judul (Inggris): ${info.title_english}\n` +
                `➲ Judul (Jepang): ${info.title_japanese}\n` +
                `➲ Tipe: ${info.type}\n` +
                `➲ Bab: ${info.chapters}\n` +
                `➲ Volume: ${info.volumes}\n` +
                `➲ Ringkasan: ${synopsisId.translation}\n` +
                `➲ URL: ${info.url}\n` +
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