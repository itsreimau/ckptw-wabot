const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "fufufafa",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://fufufafapi.vanirvan.my.id", "/api");

        try {
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data);

            return await ctx.reply({
                image: {
                    url: result.image_url
                },
                mimetype: mime.lookup("jpg"),
                caption: `${formatter.quote(`Doksli: ${result.doksli}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};