const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "googlesearch",
    aliases: ["google", "gsearch"],
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/google", {
                message: input
            });
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            const resultText = data.map((d) =>
                `${quote(`Judul: ${d.title}`)}\n` +
                `${quote(`Deskripsi: ${d.snippet}`)}\n` +
                `${quote(`URL: ${d.link}`)}`
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