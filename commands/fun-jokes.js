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

        const apiUrl = global.tools.api.createUrl("https://candaan-api.vercel.app", "/api/text/random", {});

        try {
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            return ctx.reply(data);
        } catch (error) {
            console.error("Error:", error);
            return message.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};