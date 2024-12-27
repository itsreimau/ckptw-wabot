const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "apkmirrorsearch",
    aliases: ["apkmirror", "apkmirrors"],
    category: "search",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("gifted", "/api/search/apkmirror", {
                query: input
            }, "apikey");
            const data = (await axios.get(apiUrl)).data.results;

            const resultText = data.map((d) =>
                `${quote(`Nama: ${d.title}`)}\n` +
                `${quote(`Pengembang: ${d.developer.toString() || "-"}`)}\n` +
                `${quote(`Versi: ${d.version}`)}\n` +
                `${quote(`Ukuran: ${d.size}`)}\n` +
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
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};