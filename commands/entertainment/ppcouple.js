const axios = require("axios");

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

            return await ctx.reply({
                album: [{
                        image: {
                            url: result.male
                        },
                        mimetype: tools.mime.lookup("jpeg")
                    },
                    {
                        image: {
                            url: result.female
                        },
                        mimetype: tools.mime.lookup("jpeg")
                    }
                ],
                caption: formatter.quote("Untukmu, tuan!")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};