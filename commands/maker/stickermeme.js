const {
    quote
} = require("@mengkodingan/ckptw");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "stickermeme",
    aliases: ["smeme", "stikermeme"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "i want to be a cat|just meow meow"))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, ["image", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted, ["image", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], ["image", "sticker"])));

        try {
            let [top, bottom] = input.split("|").map(i => i.trim());
            [top, bottom] = bottom ? [top || "_", bottom] : ["_", top || "_"];

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("https://api.memegen.link", `/images/custom/${top}/${bottom}.png`, {
                background: uploadUrl
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