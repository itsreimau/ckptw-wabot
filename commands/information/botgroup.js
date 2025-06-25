const {
    quote
} = require("@itsreimau/gktw");

module.exports = {
    name: "botgroup",
    aliases: ["botgc", "gcbot"],
    category: "information",
    code: async (ctx) => {
        return await ctx.reply(quote(config.bot.groupLink));
    }
};