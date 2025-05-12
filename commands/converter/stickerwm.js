const {
    quote
} = require("@im-dims/baileys-library");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "stickerwm",
    aliases: ["swm", "stikerwm"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send", "reply"], ["text", "sticker"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "get in the fucking robot|shinji!"))
        );

        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], ["sticker"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const [packname, author] = input.split("|");
            const result = new Sticker(buffer, {
                pack: packname || "",
                author: author || "",
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await result.toMessage());
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};