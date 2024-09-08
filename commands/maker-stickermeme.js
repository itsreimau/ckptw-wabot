const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "stickermeme",
    aliases: ["smeme", "stikermeme"],
    category: "maker",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} i want to be a cat|just meow meow`)}`)
        );

        const msgType = ctx.getMessageType();

        if (msgType !== MessageType.imageMessage && !(await ctx.quoted.media.toBuffer())) return ctx.reply(quote(`📌 ${await global.tools.msg.translate("Berikan atau balas media berupa gambar!", userLanguage)}`));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const [top, bottom] = input.split("|");
            const uplRes = await uploadByBuffer(buffer, mime.contentType("png"));
            const result = global.tools.api.createUrl("https://api.memegen.link", `/images/custom/${top || ""}/${bottom || ""}.png`, {
                background: uplRes.link
            });
            const sticker = new Sticker(result, {
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
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};