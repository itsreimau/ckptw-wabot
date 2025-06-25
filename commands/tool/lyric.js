const axios = require("axios");

module.exports = {
    name: "lyric",
    aliases: ["lirik"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada"))
        );

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/search/lyrics", {
                query: input
            });
            const result = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${formatter.quote(`Judul: ${result.title}`)}\n` +
                `${formatter.quote("─────")}\n` +
                `${result.lyrics}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};