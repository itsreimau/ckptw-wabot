const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");

module.exports = {
    name: "yahoosearch",
    aliases: ["yahoo", "yahoos"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/search/yahoosearch", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map((r) =>
                `${quote(`Judul: ${r.title}`)}\n` +
                `${quote(`Deskripsi: ${r.snippet}`)}\n` +
                `${quote(`URL: ${r.link}`)}`
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
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};