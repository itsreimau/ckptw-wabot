const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "halodocsearch",
    aliases: ["halodoc", "halodocs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "anhedonia"))
        );

        try {
            const apiUrl = tools.api.createUrl("diioffc", "/api/search/halodoc", {
                query: input
            });
            const data = (await axios.get(apiUrl)).data.result;

            const resultText = data.map((d) =>
                `${quote(`Judul: ${d.judul}`)}\n` +
                `${quote(`Deskripsi: ${d.deskripsi}`)}\n` +
                `${quote(`URL: ${d.tautan}`)}`
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