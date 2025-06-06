const axios = require("axios");

module.exports = {
    name: "joke",
    aliases: ["jokes"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://candaan-api.vercel.app", "/api/text/random");

        try {
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};