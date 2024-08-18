const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "happymod",
    aliases: ["hm", "hmsearch"],
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
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} evangelion`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/happymod", {
                search: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data.hsl.map((d) =>
                `${quote(`Nama: ${d.name}`)}\n` +
                `${quote(`Versi: ${d.version}`)}\n` +
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