const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "qc",
    aliases: ["bubblechat"],
    category: "maker",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: [5, "text", 1]
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "get in the fucking robot, shinji!"))
        );

        if (input.length > 10000) return ctx.reply(quote(`❎ Maksimal 50 kata!`));

        try {
            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            } catch (error) {
                profilePictureUrl = global.config.bot.picture.profile;
            }

            const apiUrl = global.tools.api.createUrl("widipe", "/quotely", {
                avatar: profilePictureUrl,
                name: ctx.sender.pushName || "-",
                text: input
            });

            const sticker = new Sticker(apiUrl, {
                pack: global.config.sticker.packname,
                author: global.config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};