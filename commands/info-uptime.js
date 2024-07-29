const {
    general
} = require("../tools/exports.js");

module.exports = {
    name: "uptime",
    category: "info",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const startTime = global.system.startTime;
        return ctx.reply(`Bot telah aktif selama ${general.convertMsToDuration(Date.now() - startTime) || "kurang dari satu detik"}.`);
    }
};