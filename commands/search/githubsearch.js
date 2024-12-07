const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["github", "githubs"],
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
            const apiUrl = await tools.api.createUrl("agatz", "/api/github", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.map((d) =>
                `${quote(`Nama: ${d.fullName}`)}\n` +
                `${quote(`Deskripsi: ${d.description}`)}\n` +
                `${quote(`Watchers: ${d.watchers}`)}\n` +
                `${quote(`Jumlah Stargazers: ${d.stargazersCount}`)}\n` +
                `${quote(`Issues terbuka: ${d.openIssues}`)}\n` +
                `${quote(`Forks: ${d.forks}`)}\n` +
                `${quote(`URL: ${d.htmlUrl}`)}`
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