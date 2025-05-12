const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "botgroup",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote(config.bot.groupLink));
    }
};