const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "milf",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nekorinn", "/waifuim/milf");

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