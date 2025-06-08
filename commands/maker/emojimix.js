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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "😱 🤓"))
        );

        try {
            const result = tools.api.createUrl("falcon", "/tools/emojimix", {
                emoji1,
                emoji2
            });
            const sticker = new Sticker(result, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await sticker.toMessage());
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};