const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta", "tahukahanda"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const apiUrl = tools.api.createUrl("https://cinnabar.icaksh.my.id", "/public/daily/tawiki");
            const {
                data
            } = (await axios.get(apiUrl)).data;
            const result = tools.general.getRandomElement(data.info);

            return await ctx.reply(quote(`Tahukah Anda? ${result.tahukah_anda}`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};