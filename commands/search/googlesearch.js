const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "googlesearch",
    aliases: ["google", "googles"],
    category: "search",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/googlev1", {
                q: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.map((d) =>
                `${quote(`Judul: ${d.title}`)}\n` +
                `${quote(`Deskripsi: ${d.desc}`)}\n` +
                `${quote(`URL: ${d.link}`)}`
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