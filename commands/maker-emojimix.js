const {
    bold,
    quote
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
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: 10
        });
        if (status) return ctx.reply(message);

        if (!ctx.args.length) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "😱 🤓"))
        );

        try {
            const emojisString = ctx.args.join("");
            const emojiRegex = /\p{Emoji}/gu;
            const emojis = Array.from(emojisString.matchAll(emojiRegex), (match) => match[0]);
            const [emoji1, emoji2] = emojis.slice(0, 2);
            const apiUrl = global.tools.api.createUrl("https://tenor.googleapis.com", "/v2/featured", {
                key: "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ",
                contentfilter: "high",
                media_filter: "png_transparent",
                component: "proactive",
                collection: "emoji_kitchen_v5",
                q: `${emoji1}_${emoji2}`
            });
            const response = await axios.get(apiUrl);
            const data = await response.data;

            if (!data.results[0].url) return ctx.reply(global.config.msg.notFound);

            const sticker = new Sticker(data.results[0].url, {
                pack: global.config.sticker.packname,
                author: global.config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("[ckptw-wabot] Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};