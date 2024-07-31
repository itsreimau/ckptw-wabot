const {
    convertMsToDuration
} = require("../tools/general.js");

module.exports = {
    name: "uptime",
    category: "info",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) {
            return ctx.reply(message);
        }

        const uptime = convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik";
        return ctx.reply(`Bot telah aktif selama ${uptime}.`);
    }
};