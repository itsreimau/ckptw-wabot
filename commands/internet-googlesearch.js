const {
    api
} = require("../tools/exports.js");
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
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(`${global.msg.argument}\n` + `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`);

        try {
            const apiUrl = await api.createUrl("ngodingaja", "/api/gsearch", {
                search: input
            });
            const response = await axios.get(apiUrl);

            const data = await response.data;

            const resultText = data.result.map((d) =>
                `➲ Judul: ${d.title}\n` +
                `➲ Deskripsi: ${d.snippet}\n` +
                `➲ URL: ${d.url}`
            ).join("\n-----\n");
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