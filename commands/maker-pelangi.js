const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "pelangi",
    category: "maker",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            let profilePicture;
            try {
                profilePicture = await ctx._client.profilePictureUrl(ctx._sender.jid, "image");
            } catch (_) {
                profilePicture = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const apiUrl = createAPIUrl("ngodingaja", "/api/pelangi", {
                url: profilePicture
            });

            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

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
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};