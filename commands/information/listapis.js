const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "listapis",
    aliases: ["listapi"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
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
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};