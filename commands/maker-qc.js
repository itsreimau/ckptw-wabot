const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
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
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} get in the fucking robot, shinji!`)}`
        );

        try {
            if (input.length > 10000) return ctx.reply(`${bold("[ ! ]")} Maksimal 50 kata!`);

            let profileUrl;
            try {
                profileUrl = await ctx._client.profilePictureUrl(ctx._sender.jid, "image");
            } catch {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const apiUrl = createAPIUrl("ngodingaja", "/api/bubblechat", {
                text: input,
                url: profileUrl,
                nama: ctx._sender.pushName
            });

            const sticker = new Sticker(apiUrl, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${errorMessage}`);
        }
    }
};