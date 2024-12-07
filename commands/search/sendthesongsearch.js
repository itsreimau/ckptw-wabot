const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "sendthesongsearch",
    aliases: ["sendthesong", "sendthesongs"],
    category: "search",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))
        );

        try {
            const apiUrl = await tools.api.createUrl("ssateam", "/api/sendthesong", {
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
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};