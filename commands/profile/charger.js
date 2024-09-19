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
            global.db.get(`user.${senderNumber}.energy`) || 0,
            global.db.get(`user.${senderNumber}.onCharger`) || false,
            global.db.get(`user.${senderNumber}.lastCharge`) || 0
        ]);

        if (userEnergy > 15) return ctx.reply(quote(`⚡ Anda masih memiliki cukup energi, tidak perlu mengisinya kembali.`));

        if (isOnCharger) return ctx.reply(quote(`⚡ Sedang mengisi ulang energi Anda.`));

        if (lastCharge && Date.now() - lastCharge < 24 * 60 * 60 * 1000) return ctx.reply(quote(`⚡ Anda baru saja mengisi energi. Silakan tunggu sampai besok untuk mengisi energi lagi.`));

        global.db.set(`user.${senderNumber}.onCharger`, true);
        global.db.set(`user.${senderNumber}.lastCharge`, Date.now());

        return ctx.reply(quote(`🔌 Sekarang bot akan mengisi 25 energi setiap 1 menit.`));
    }
};