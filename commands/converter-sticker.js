const {
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "sticker",
    aliases: ["s", "stiker"],
    category: "converter",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !(await ctx.quoted.media.toBuffer())) return ctx.reply(quote(global.tools.msg.generateInstruction(["send", "reply"], ["image", "gif", "video"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const sticker = new Sticker(buffer, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50,
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("[ckptw-wabot] Error", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};