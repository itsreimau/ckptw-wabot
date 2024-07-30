const {
    convertMsToDuration
} = require("../tools/simple.js");

module.exports = {
    name: "uptime",
    category: "info",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) {
            return ctx.reply(handlerObj.message);
        }

        const uptime = convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik";
        return ctx.reply(`Bot telah aktif selama ${uptime}.`);
    }
};