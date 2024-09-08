const {
    monospace,
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
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} get in the fucking robot, shinji!`)}`)
        );

        if (input.length > 10000) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Maksimal 50 kata!", userLanguage)}`));

        try {
            let profileUrl;
            try {
                profileUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            } catch {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const apiUrl = global.tools.api.createUrl("ngodingaja", "/api/bubblechat", {
                text: input,
                url: profileUrl,
                nama: ctx.sender.pushName
            });

            const response = await axios.get(apiUrl);
            const sticker = new Sticker(response.data.url, {
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
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};