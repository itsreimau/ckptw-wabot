const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["ghs", "ghsearch"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "ckptw-wabot"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/github", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.map((d) =>
                `${quote(`Nama: ${d.fullName}`)}\n` +
                `${quote(`Fork: ${d.fork ? "Ya" : "Tidak"}`)}\n` +
                `${quote(`URL: ${d.htmlUrl}`)}\n` +
                `${quote(`Dibuat pada: ${d.createdAt}`)}\n` +
                `${quote(`Diperbarui pada: ${d.updatedAt}`)}\n` +
                `${quote(`Jumlah pengamat: ${d.watchers}`)}\n` +
                `${quote(`Jumlah garpu: ${d.forks}`)}\n` +
                `${quote(`Jumlah pengamat bintang: ${d.stargazersCount}`)}\n` +
                `${quote(`Jumlah isu terbuka: ${d.openIssues}`)}\n` +
                `${quote(`Deskripsi: ${d.description || "-"}`)}\n` +
                `${quote(`URL kloning: ${d.cloneUrl}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};