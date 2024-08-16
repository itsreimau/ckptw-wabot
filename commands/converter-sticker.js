const {
    bold,
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
            banned: true
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.quoted;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(quote(`${bold("[ ! ]")} Berikan atau balas media berupa gambar, GIF, atau video!`));

        try {
            if (quotedMessage) {
                const type = quotedMessage ? ctx.getContentType(quotedMessage) : null;
                const object = type ? quotedMessage[type] : null;
                const stream = await ctx.downloadContentFromMessage(object, type.slice(0, -7));
                let quotedBuffer = Buffer.from([]);
                for await (const chunk of stream) {
                    quotedBuffer = Buffer.concat([quotedBuffer, chunk]);
                }
            }
            const buffer = type === "imageMessage" || type === "videoMessage" ? quotedBuffer : await ctx.getMediaMessage(ctx._msg, "buffer");
            const sticker = new Sticker(buffer, {
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
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};