const {
    monospace,
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
    name: "stickerwm",
    aliases: ["swm", "stikerwm"],
    category: "converter",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} i want to be a cat|just meow meow`)}`)
        );

        const msgType = ctx.getMessageType();

        if (msgType !== MessageType.stickerMessage || !(await ctx.quoted.media.toBuffer())) return ctx.reply(quote(`📌 ${await global.tools.msg.translate("Berikan atau balas media berupa sticker!", userLanguage)}`));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
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
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};