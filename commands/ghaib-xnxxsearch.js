const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "xnxxsearch",
    category: "ghaib",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            premium: true
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} stepsister`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/xnxx", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data.result.map((d) =>
                `${quote(`Judul: ${d.title}`)}\n` +
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