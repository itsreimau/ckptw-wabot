module.exports = {
    name: "botgroup",
    aliases: ["botgc", "gcbot"],
    category: "information",
    code: async (ctx) => {
        return await ctx.reply(formatter.quote(config.bot.groupLink));
    }
};