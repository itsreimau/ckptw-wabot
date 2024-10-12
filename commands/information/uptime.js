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
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const uptime = global.tools.general.convertMsToDuration(Date.now() - global.config.bot.readyAt);
        return ctx.reply(quote(`Bot telah aktif selama ${uptime}.`));
    }
};