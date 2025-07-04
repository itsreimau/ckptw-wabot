const axios = require("axios");

module.exports = {
    name: "ayanamirei",
    aliases: ["ayanami", "rei", "reiayanami"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://api.github.com", "/repos/Yashirof/ayanami-bot-discord/contents/images");

        try {
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            return await ctx.reply({
                image: {
                    url: result.download_url
                },
                mimetype: tools.mime.lookup("jpg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};