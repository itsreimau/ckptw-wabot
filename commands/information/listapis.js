const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "listapis",
    aliases: ["listapi"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const APIs = tools.api.listUrl();
            let resultText = "";

            for (const [name, api] of Object.entries(APIs)) {
                resultText += quote(`${api.baseURL}\n`);
            }

            return await ctx.reply(
                `${quote("Daftar API yang digunakan: (Tanpa API ini, bot tidak akan berfungsi dengan baik)")}\n` +
                `${resultText.trim()}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};