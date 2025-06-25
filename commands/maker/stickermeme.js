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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot|shinji!"))
        );

        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, ["image", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted, ["image", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["image", "sticker"])));

        try {
            let [top, bottom] = input.split("|").map(i => i.trim());
            [top, bottom] = bottom ? [top || "_", bottom] : ["_", top || "_"];

            const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const result = tools.api.createUrl("nirkyy", `/api/v1/memegen`, {
                text_atas: top,
                text_bawah: bottom,
                background: uploadUrl
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