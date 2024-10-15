const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    category: "information",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const uptime = global.tools.general.convertMsToDuration(Date.now() - global.config.bot.readyAt);
        return await ctx.reply(quote(`Bot telah aktif selama ${uptime}.`));
    }
};