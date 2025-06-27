const axios = require("axios");

module.exports = {
    name: "proverb",
    aliases: ["peribahasa"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("http://jagokata-api.hofeda4501.serv00.net", "/peribahasa-acak.php"); // Dihosting sendiri, karena jagokata-api.rf.gd malah error

        try {
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data);

            return await ctx.reply(
                `${formatter.quote(`Kalimat: ${result.kalimat}`)}\n` +
                `${formatter.quote(`Arti: ${result.arti}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};