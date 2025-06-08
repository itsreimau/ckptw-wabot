const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "cecan",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const random = tools.cmd.getRandomElement(["china", "indonesia", "japan", "vietnam", "korea", "malaysia", "thailand"]);
        const apiUrl = tools.api.createUrl("agatz", `/api/${random}`);

        try {
            const result = (await axios.get(apiUrl)).data.data.url;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};