const {
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
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        if (!ctx.args.length) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "😱 🤓"))
        );

        try {
            const emojisString = ctx.args.join("");
            const emojiRegex = /\p{Emoji}/gu;
            const emojis = Array.from(emojisString.matchAll(emojiRegex), (match) => match[0]);
            const [emoji1, emoji2] = emojis.slice(0, 2);
            const apiUrl = tools.api.createUrl("https://tenor.googleapis.com", "/v2/featured", {
                key: "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ",
                contentfilter: "high",
                media_filter: "png_transparent",
                component: "proactive",
                collection: "emoji_kitchen_v5",
                q: `${emoji1}_${emoji2}`
            });
            const {
                data
            } = await axios.get(apiUrl);

            if (!data.results[0].url) return await ctx.reply(config.msg.notFound);

            const sticker = new Sticker(data.results[0].url, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};