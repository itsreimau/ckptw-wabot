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
    name: "stickersearch",
    aliases: ["ssearch"],
    category: "internet",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3,
            private: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} evangelion`)}`)
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/sticker", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            await ctx.reply(
                `${quote(`${await global.tools.msg.translate("Judul", userLanguage)}: ${data.title}`)}\n` +
                `${quote(await global.tools.msg.translate("Stiker akan dikirim. (Tunda 3 detik untuk menghindari spam)", userLanguage))}\n` +
                "\n" +
                global.msg.footer
            );

            for (let i = 0; i < data.sticker_url.length; i++) {
                const sticker = new Sticker(data.sticker_url[i], {
                    pack: global.sticker.packname,
                    author: global.sticker.author,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: ctx.id,
                    quality: 50,
                });

                await ctx.reply(await sticker.toMessage());
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};