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
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        await global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            global.tools.general.checkMedia(msgType, ["image", "gif", "video"], ctx),
            global.tools.general.checkQuotedMedia(ctx.quoted, ["image", "gif", "video"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return ctx.reply(quote(global.tools.msg.generateInstruction(["send", "reply"], ["image", "gif", "video"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const sticker = new Sticker(buffer, {
                pack: global.config.sticker.packname,
                author: global.config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50,
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};