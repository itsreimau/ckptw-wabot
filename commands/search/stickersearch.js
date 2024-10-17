const {
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
    category: "search",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1],
        private: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "evangelion"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/sticker", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            await ctx.reply(
                `${quote(`Judul: ${data.title}`)}\n` +
                `${quote("Stiker akan dikirim. (Tunda 3 detik untuk menghindari spam)")}\n` +
                "\n" +
                global.config.msg.footer
            );

            for (let i = 0; i < data.sticker_url.length; i++) {
                const sticker = new Sticker(data.sticker_url[i], {
                    pack: global.config.sticker.packname,
                    author: global.config.sticker.author,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: ctx.id,
                    quality: 50,
                });

                await ctx.reply(await sticker.toMessage());
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};