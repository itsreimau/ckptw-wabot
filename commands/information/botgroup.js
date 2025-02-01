const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "botgroup",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote(config.bot.groupLink));
    }
};