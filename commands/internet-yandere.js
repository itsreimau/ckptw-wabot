const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "yans",
    aliases: ["yande", "yandere"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const apiUrl = createAPIUrl("ssa", "/api/yans", {
                query: input
            });
            const response = await axios.get(apiUrl);

            const data = response.data;

            return await ctx.reply({
                image: {
                    url: data.data.response
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Yande.re")}\n` +
                    "\n" +
                    `➲ Kueri: ${input}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};