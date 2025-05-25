const mime = require("mime-types");

module.exports = {
    name: "cosplay",
    aliases: ["cosplayer"],
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("archive", "/api/random/cosplay");

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