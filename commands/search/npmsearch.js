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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "gktw"))
        );

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/search/npmjs", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(r =>
                `${formatter.quote(`Nama: ${r.name}`)}\n` +
                `${formatter.quote(`Versi: ${r.version}`)}\n` +
                `${formatter.quote(`URL: ${r.npmLink}`)}`
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