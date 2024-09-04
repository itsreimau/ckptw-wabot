const {
    createAPIUrl
} = require("../tools/api.js");
const {
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "jokes",
    category: "fun",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const apiUrl = createAPIUrl("https://candaan-api.vercel.app", "/api/text/random", {});

        try {
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            return ctx.reply(data);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return message.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};