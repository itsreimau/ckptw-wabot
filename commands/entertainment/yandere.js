const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "yandere",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nekorinn", "/nsfw/yandere-random");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};