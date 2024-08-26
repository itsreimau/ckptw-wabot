const {
    getMediaQuotedMessage
} = require("../tools/general.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {} = require("@mengkodingan/ckptw/lib/Constant");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "stickerwm",
    aliases: ["swm", "stikerwm"],
    category: "converter",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} i want to be a cat|just meow meow`)}`)
        );

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.quoted;

        if (msgType !== MessageType.stickerMessage && !quotedMessage) return ctx.reply(quote(`📌 Berikan atau balas media berupa sticker!`));

        try {
            const type = quotedMessage ? ctx._client.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "stickerMessage" ? await getMediaQuotedMessage(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx.msg, "buffer");
            const [packname, author] = input.split("|");
            const sticker = new Sticker(buffer, {
                pack: packname || global.sticker.packname,
                author: author || global.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};