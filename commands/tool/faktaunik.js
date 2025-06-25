const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/HasamiAini/Bot_Takagisan/refs/heads/main/faktanya.txt");

        try {
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.trim().split("\n").filter(Boolean));

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};