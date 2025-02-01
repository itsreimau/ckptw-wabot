const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "bingsearch",
    aliases: ["bing", "bings"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = tools.api.createUrl("nexoracle", "/search/bing-search", {
                q: input
            }, "apikey");
            const data = (await axios.get(apiUrl)).data.result;

            const resultText = data.map((d) =>
                `${quote(`Judul: ${d.title}`)}\n` +
                `${quote(`Deskripsi: ${d.description}`)}\n` +
                `${quote(`URL: ${d.url}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};