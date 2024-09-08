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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} ckptw-wabot`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/github", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const translations = await Promise.all([
                global.tools.msg.translate("Nama", userLanguage),
                global.tools.msg.translate("Fork", userLanguage),
                global.tools.msg.translate("URL", userLanguage),
                global.tools.msg.translate("Dibuat pada", userLanguage),
                global.tools.msg.translate("Diperbarui pada", userLanguage),
                global.tools.msg.translate("Jumlah pengamat", userLanguage),
                global.tools.msg.translate("Jumlah garpu", userLanguage),
                global.tools.msg.translate("Jumlah pengamat bintang", userLanguage),
                global.tools.msg.translate("Jumlah isu terbuka", userLanguage),
                global.tools.msg.translate("Deskripsi", userLanguage),
                global.tools.msg.translate("URL kloning", userLanguage)
            ]);
            const resultText = data.map((d) => {
                return `${quote(`${translations[0]}: ${d.fullName}`)}\n` +
                    `${quote(`${translations[1]}: ${d.fork ? "Y" : "N"}`)}\n` +
                    `${quote(`${translations[2]}: ${d.htmlUrl}`)}\n` +
                    `${quote(`${translations[3]}: ${d.createdAt}`)}\n` +
                    `${quote(`${translations[4]}: ${d.updatedAt}`)}\n` +
                    `${quote(`${translations[5]}: ${d.watchers}`)}\n` +
                    `${quote(`${translations[6]}: ${d.forks}`)}\n` +
                    `${quote(`${translations[7]}: ${d.stargazersCount}`)}\n` +
                    `${quote(`${translations[8]}: ${d.openIssues}`)}\n` +
                    `${quote(`${translations[9]}: ${d.description || "-"}`)}\n` +
                    `${quote(`${translations[10]}: ${d.cloneUrl}`)}\n`;
            }).join(
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
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};