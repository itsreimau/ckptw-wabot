const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["gh", "ghs", "github", "githubs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "ckptw-wabot"))
        );

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/search/github-search", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.result;

            const resultText = result.map(r =>
                `${quote(`Nama: ${r.full_name}`)}\n` +
                `${quote(`Deskripsi: ${r.description}`)}\n` +
                `${quote(`Jumlah: ${r.stars} stargazers, ${r.forks} forks`)}\n` +
                `${quote(`Bahasa: ${r.language}`)}\n` +
                `${quote(`URL: ${r.url}`)}`
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