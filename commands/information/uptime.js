const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        const uptime = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);
        return await ctx.reply(quote(`🚀 Bot telah aktif selama ${uptime}.`));
    }
};