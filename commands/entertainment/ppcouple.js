const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://sandipbaruwal.onrender.com", "/dp");

        try {
            const result = (await axios.get(apiUrl)).data;

            return await Promise.all([
                ctx.reply({
                    image: {
                        url: result.male
                    },
                    mimetype: mime.lookup("jpg")
                }),
                ctx.reply({
                    image: {
                        url: result.female
                    },
                    mimetype: mime.lookup("jpg")
                })
            ]);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};