const axios = require("axios");

module.exports = {
    name: "googlesearch",
    aliases: ["google", "googles"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/search/google", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(r =>
                `${formatter.quote(`Judul: ${r.title}`)}\n` +
                `${formatter.quote(`Deskripsi: ${r.desc}`)}\n` +
                `${formatter.quote(`URL: ${r.url}`)}`
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
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