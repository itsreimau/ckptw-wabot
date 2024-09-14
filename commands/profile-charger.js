const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "charger",
    aliase: ["charge"],
    category: "profile",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const senderNumber = ctx.sender.jid.replace(/@.*|:.*/g, "");

        const isOnCharger = global.db.get(`user.${senderNumber}.onCharger`);
        if (isOnCharger) return ctx.reply(quote(`⚡ Anda sudah mengisi energi sebelumnya. Tidak perlu mengisi lagi.`));

        global.db.set(`user.${senderNumber}.onCharger`, true);

        return ctx.reply(quote(`🔌 Sekarang bot akan mengisi energi untuk Anda setiap menit.`));
    }
};