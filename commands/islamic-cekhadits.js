const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "cekhadits",
    category: "islamic",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} إنما الأعمال بالنيات`)}`
        );

        try {
            const apiUrl = createAPIUrl("http://dorar.net", "/dorar_api.json", {
                skey: input
            });
            const response = await axios.get(apiUrl);

            const data = await response.data;
            let ahadith = data.ahadith.result;
            ahadith = ahadith.replace(/<a[^>]*>المزيد<\/a>/g, "");
            const formattedAhadith = ahadith.replace(/<[^>]*>/g, "").trim();

            return ctx.reply(formattedAhadith);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};