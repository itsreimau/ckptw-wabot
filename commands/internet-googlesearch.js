const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");

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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(`${global.msg.argument}\n` + `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`);

        try {
            const apiUrl = await createAPIUrl("ngodingaja", "/api/gsearch", {
                search: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.result.map((d) =>
                `➲ Judul: ${d.title}\n` +
                `➲ Deskripsi: ${d.snippet}\n` +
                `➲ URL: ${d.link}`
            ).join(
                "\n" +
                "-----\n"
            );
            return ctx.reply(
                `❖ ${bold("Google Search")}\n` +
                "\n" +
                `${resultText}\n` +
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