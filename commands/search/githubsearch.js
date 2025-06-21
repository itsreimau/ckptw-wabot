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
            const apiUrl = tools.api.createUrl("bk9", "/search/github", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.BK9.items;

            const resultText = result.map(r =>
                `${quote(`Nama: ${r.full_name}`)}\n` +
                `${quote(`Deskripsi: ${r.description}`)}\n` +
                `${quote(`Jumlah: ${r.stargazers_count} stargazers, ${r.watchers_count} watchers, ${r.forks_count} forks, ${r.open_issues_count} issues terbuka`)}\n` +
                `${quote(`Bahasa: ${r.language}`)}\n` +
                `${quote(`Lisensi: ${r.license.name}`)}\n` +
                `${quote(`URL: ${r.html_url}`)}`
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