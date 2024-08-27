const {
    listAPIUrl
} = require("../tools/api.js");
const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "checkapis",
    aliases: ["cekapi", "checkapi"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        try {
            await ctx.reply(global.msg.wait);

            const APIs = listAPIUrl();
            let result = "";

            for (const [name, api] of Object.entries(APIs)) {
                try {
                    const response = await axios.get(api.baseURL, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
                        }
                    });
                    result += quote(`${api.baseURL} 🟢\n`);
                } catch (error) {
                    result += quote(`${api.baseURL} 🔴\n`);
                }
            }

            return ctx.reply(
                `${result.trim()}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};