const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["ghs", "ghsearch"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ckptw-wabot`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/github", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data.result.map((d) =>
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
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};