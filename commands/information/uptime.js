const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote(`🚀 Bot telah aktif selama ${config.bot.uptime}.`));
    }
};