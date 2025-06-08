const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const uptime = tools.msg.convertMsToDuration(Date.now() - config.bot.readyAt);
            return await ctx.reply(quote(`🚀 Bot telah aktif selama ${uptime}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};