const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "emojimix",
    aliases: ["emix"],
    category: "maker",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 😱 🤓`)}`
        );

        try {
            const emojisString = ctx._args.join("");

            const emojiRegex = /\p{Emoji}/gu;
            const emojis = Array.from(emojisString.matchAll(emojiRegex), (match) => match[0]);

            const [emoji1, emoji2] = emojis.slice(0, 2);

            const apiUrl = createAPIUrl("https://tenor.googleapis.com", `/v2/featured`, {
                key: "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ",
                contentfilter: "high",
                media_filter: "png_transparent",
                component: "proactive",
                collection: "emoji_kitchen_v5",
                q: `${emoji1}_${emoji2}`
            });
            const response = await axios.get(apiUrl);
            const data = await response.data;

            if (!data.results[0].url) return ctx.reply(global.msg.notFound);

            const sticker = new Sticker(data.results[0].url, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};