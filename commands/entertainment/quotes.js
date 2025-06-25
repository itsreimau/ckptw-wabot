const {
    quote
} = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "quotes",
    aliases: ["quote"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://jagokata-api.rf.gd", "/acak.php");

        try {
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data.quotes);

            return await ctx.reply(
                `${quote(`“${result.quote}”`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Nama: ${result.author.name}`)}\n` +
                `${quote(`Deskripsi: ${result.author.description}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};