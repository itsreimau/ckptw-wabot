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

        const [userEnergy, isOnCharger, lastCharge] = await Promise.all([
            global.db.get(`user.${senderNumber}.energy`),
            global.db.get(`user.${senderNumber}.onCharger`),
            global.db.get(`user.${senderNumber}.lastCharge`)
        ]);

        userEnergy = userEnergy || 0;
        isOnCharger = isOnCharger || false;
        lastCharge = lastCharge || 0;

        if (userEnergy >= 100) return ctx.reply(quote(`⚡ Energi Anda sudah penuh. Anda tidak bisa mengisi energi lagi.`));

        if (isOnCharger) return ctx.reply(quote(`⚡ Anda sudah mengisi energi sebelumnya. Tidak perlu mengisi lagi.`));

        if (lastCharge && Date.now() - lastCharge < 24 * 60 * 60 * 1000) return ctx.reply(quote(`⚡ Anda baru saja mengisi energi. Silakan tunggu sampai besok untuk mengisi energi lagi.`));

        global.db.set(`user.${senderNumber}.onCharger`, true);

        return ctx.reply(quote(`🔌 Sekarang bot akan mengisi energi untuk Anda setiap menit.`));
    }
};