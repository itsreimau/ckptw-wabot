const {
    quote
} = require("@itsreimau/ckptw-mod");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "emojimix",
    aliases: ["emix"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const emojisString = ctx.args.join("");
        const emojiRegex = /\p{Emoji}/gu;
        const emojis = Array.from(emojisString.matchAll(emojiRegex), (match) => match[0]);
        const [emoji1, emoji2] = emojis.slice(0, 2);

        if (!emoji1 || !emoji2) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "😱 🤓"))
        );

        try {
            const apiUrl = tools.api.createUrl("falcon", "/tools/emojimix", {
                emoji1,
                emoji2
            });
            const result = new Sticker(apiUrl, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await result.toMessage());
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};