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
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(await global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} ckptw-wabot`)}`)
        );

        try {
            const apiUrl = await await global.tools.api.createUrl("agatz", "/api/github", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data.map((d) =>
                `${quote(`${await global.tools.msg.translate("Nama", userLanguage)}: ${d.fullName}`)}\n` +
                `${quote(`Fork: ${d.fork ? "Y" : "N"}`)}\n` +
                `${quote(`URL: ${d.htmlUrl}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Dibuat pada", userLanguage)}: ${d.createdAt}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Diperbarui pada", userLanguage)}: ${d.updatedAt}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Jumlah pengamat", userLanguage)}: ${d.watchers}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Jumlah garpu", userLanguage)}: ${d.forks}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Jumlah pengamat bintang", userLanguage)}: ${d.stargazersCount}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Jumlah isu terbuka", userLanguage)}: ${d.openIssues}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Deskripsi", userLanguage)}: ${d.description || "-"}`)}\n` +
                `${quote(`${await global.tools.msg.translate("URL kloning", userLanguage)}: ${d.cloneUrl}`)}`
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
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};