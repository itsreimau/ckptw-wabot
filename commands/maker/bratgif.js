const {
    quote
} = require("@mengkodingan/ckptw");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "bratgif",
    aliases: ["bratg", "bratv", "bratvid", "bratvideo", "sbratgif", "sbratvideo", "sbratvid", "stickerbratgif", "stickerbratvideo", "stickerbratvid", "stikerbratgif", "stikerbratvideo", "stikerbratvid"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 10000) return await ctx.reply(quote("❎ Maksimal 10000 kata!"));

        try {
            const apiUrl = tools.api.createUrl("fast", "/maker/brat/animated", {
                text: input,
                mode: "animated"
            });
            const result = new Sticker(apiUrl, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await result.toMessage());
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};