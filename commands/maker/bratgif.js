const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
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
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 1000) return await ctx.reply(quote("❎ Maksimal 1000 kata!"));

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/maker/bratvid", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.url;
            const sticker = new Sticker(result, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await sticker.toMessage());
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};