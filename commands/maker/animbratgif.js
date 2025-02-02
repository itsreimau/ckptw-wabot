const {
    quote
} = require("@mengkodingan/ckptw");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "animbratgif",
    aliases: ["animbratg", "animbratgif", "animbratv", "animbratvid", "animbratvideo", "sanimbratgif", "sanimbratvideo", "sanimbratvid", "stickeranimbratgif", "stickeranimbratvideo", "stickeranimbratvid", "stikeranimbratgif", "stikeranimbratvideo", "stikeranimbratvid"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "get in the fucking robot, shinji!"))
        );

        if (input.length > 10000) return await ctx.reply(quote(`❎ Maksimal 10000 kata!`));

        try {
            const apiUrl = tools.api.createUrl("fasturl", "/maker/animbrat", {
                text: input,
                mode: "animated"
            });

            const sticker = new Sticker(apiUrl, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await sticker.toMessage());
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};