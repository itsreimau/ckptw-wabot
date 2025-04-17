const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "asupan",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("agatz", "/api/asupan");

        try {
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};