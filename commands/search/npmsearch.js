const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "npmsearch",
    aliases: ["npm", "npms"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "ckptw-mod"))
        );

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/search/npmjs", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(r =>
                `${quote(`Nama: ${r.name}`)}\n` +
                `${quote(`Dekripsi: ${r.description}`)}\n` +
                `${quote(`Pembuat: ${r.author}`)}\n` +
                `${quote(`Versi: ${r.version}`)}\n` +
                `${quote(`URL: ${r.npmLink}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText || config.msg.notFound}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};