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
    name: "animeinfo",
    aliases: ["anime"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl("https://api.jikan.moe", "/v4/anime", {
                q: input
            });
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;
            const info = data.data[0];
            const synopsisId = info.synopsis ? await translate(info.synopsis, "en", "id") : null;

            return ctx.sendMessage(
                ctx.id, {
                    text: `❖ ${bold("Anime Info")}\n` +
                        "\n" +
                        `➲ Judul: ${info.title}\n` +
                        `➲ Judul (Inggris): ${info.title_english}\n` +
                        `➲ Judul (Jepang): ${info.title_japanese}\n` +
                        `➲ Tipe: ${info.type}\n` +
                        `➲ Episode: ${info.episodes}\n` +
                        `➲ Durasi: ${info.duration}\n` +
                        `➲ Ringkasan: ${synopsisId.translation}\n` +
                        `➲ URL: ${info.url}\n` +
                        "\n" +
                        global.msg.footer,
                    contextInfo: {
                        externalAdReply: {
                            title: "A N I M E I N F O",
                            body: null,
                            thumbnailUrl: info.images.jpg.large_image_url,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};