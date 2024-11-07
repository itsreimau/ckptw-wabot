const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const uptime = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);
        return await ctx.reply(quote(`Bot telah aktif selama ${uptime}.`));
    }
};