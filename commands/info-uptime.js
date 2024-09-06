const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const uptime = global.tools.general.convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik.";

        return ctx.reply(quote(`🚀 ${await global.tools.msg.translate(`Bot telah aktif selama ${uptime}.`, userLanguage)}`));
    }
};