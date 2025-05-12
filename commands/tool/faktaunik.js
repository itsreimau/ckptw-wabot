const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta", "tahukahanda"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://cinnabar.icaksh.my.id", "/public/daily/tawiki");

        try {
            const result = tools.general.getRandomElement((await axios.get(apiUrl)).data.data.info).tahukah_anda;

            return await ctx.reply(quote(`Tahukah Anda? ${result}`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};