const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} get in the fucking robot, shinji!`)}`)
        );

        if (input.length > 10000) return ctx.reply(quote(`⚠ Maksimal 50 kata!`));

        try {
            let profileUrl;
            try {
                profileUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            } catch {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const apiUrl = createAPIUrl("ngodingaja", "/api/bubblechat", {
                text: input,
                url: profileUrl,
                nama: ctx.sender.pushName
            });

            const response = await fetch(apiUrl, {
                headers: {
                    'User-Agent': ''
                }
            });
            const sticker = new Sticker(response.url, {
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
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};