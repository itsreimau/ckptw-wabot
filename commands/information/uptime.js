const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    category: "information",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const uptime = global.tools.general.convertMsToDuration(Date.now() - global.config.bot.readyAt);
        return ctx.reply(quote(`Bot telah aktif selama ${uptime}.`));
    }
};