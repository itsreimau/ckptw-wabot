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
                    await axios.get(api.baseURL);
                    result += `${name}: ${api.baseURL} (Aktif)\n`;
                } catch (error) {
                    result += `${name}: ${api.baseURL} (Tidak aktif)\n`;
                }
            }

            return ctx.reply(
                result.trim() +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};