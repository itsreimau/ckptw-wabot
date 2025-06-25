const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "meme",
    aliases: ["memes"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random");

        try {
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.lookup("jpeg"),
                caption: `${formatter.quote(`Sumber: ${result.source}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};