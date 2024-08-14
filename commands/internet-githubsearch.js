const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "githubsearch",
    aliases: ["ghs"],
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
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ckptw-wabot`)}`
        );

        try {
            const apiUrl = await createAPIUrl("https://api.github.com", "/search/repositories", {
                q: input
            });
            const {
                data
            } = await axios.get(apiUrl);
            const repo = data.items[0];

            return ctx.reply(
                `${quote(`Nama: ${repo.name}`)}\n` +
                `${quote(`Deskripsi: ${repo.description}`)}\n` +
                `${quote(`Owner: ${repo.owner.login}`)}\n` +
                `${quote(`Dibuat: ${formatDate(repo.created_at)}`)}\n` +
                `${quote(`Bahasa: ${repo.language}`)}\n` +
                `${quote(`Lisensi: ${repo.license.name}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

function formatDate(date, locale = "id") {
    const dt = new Date(date);
    return dt.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
}