const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        const uptime = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);
        return await ctx.reply(quote(`🚀 Bot telah aktif selama ${uptime}.`));
    }
};