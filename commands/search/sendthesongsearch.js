const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "sendthesongsearch",
    aliases: ["sendthesong", "sendthesongs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("ssateam", "/api/sendthesong", {
                query: input
            }, "apiKey");
            const data = (await axios.get(apiUrl)).data.data.result;

            const resultText = data.map((d) =>
                `${quote(`Penerima: ${d.recipient}`)}\n` +
                `${quote(`Pesan: ${d.message}`)}\n` +
                `${quote(`Lagu: ${d.songName} - ${d.songArtist}`)}`
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