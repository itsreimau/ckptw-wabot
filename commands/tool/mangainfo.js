const {
    quote
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "mangainfo",
    aliases: ["manga"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("https://api.jikan.moe", "/v4/manga", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.data[0];

            return await ctx.reply(
                `${quote(`Judul: ${result.title}`)}\n` +
                `${quote(`Judul (Inggris): ${result.title_english}`)}\n` +
                `${quote(`Judul (Jepang): ${result.title_japanese}`)}\n` +
                `${quote(`Tipe: ${result.type}`)}\n` +
                `${quote(`Bab: ${result.chapters}`)}\n` +
                `${quote(`Volume: ${result.volumes}`)}\n` +
                `${quote(`URL: ${result.url}`)}\n` +
                `${quote("─────")}\n` +
                `${await tools.cmd.translate(result.synopsis, "id")}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};