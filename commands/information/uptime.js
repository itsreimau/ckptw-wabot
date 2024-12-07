const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const uptime = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);
        return await ctx.reply(quote(`🟢 Bot telah aktif selama ${uptime}.`));
    }
};