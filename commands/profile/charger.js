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

        const [isOwner, isPremium] = await Promise.all([
            tools.general.isOwner(ctx, senderNumber, true),
            global.db.get(`user.${senderNumber}.isPremium`) || false
        ]);

        if (isOwner) return ctx.reply(quote(`⚡ Anda adalah Owner, tidak perlu mengisi energi.`));

        if (isPremium) return ctx.reply(quote(`⚡ Anda adalah pengguna premium, energi Anda tidak terbatas!`));

        const [userEnergy, isOnCharger, lastCharge] = await Promise.all([
            global.db.get(`user.${senderNumber}.energy`) || 0,
            global.db.get(`user.${senderNumber}.onCharger`) || false,
            global.db.get(`user.${senderNumber}.lastCharge`) || 0
        ]);

        if (userEnergy > 15) return ctx.reply(quote(`⚡ Anda masih memiliki cukup energi, tidak perlu mengisinya kembali.`));

        if (isOnCharger) return ctx.reply(quote(`⚡ Sedang mengisi ulang energi Anda.`));

        if (lastCharge && Date.now() - lastCharge < 24 * 60 * 60 * 1000) return ctx.reply(quote(`⚡ Anda baru saja mengisi energi. Silakan tunggu sampai besok untuk mengisi energi lagi.`));

        const energyPerInterval = 25; // 25 energi setiap 15 menit.
        const intervalTime = 15 * 60 * 1000; // 15 menit dalam milidetik.
        const energyToFull = 100 - userEnergy;
        const totalIntervals = Math.ceil(energyToFull / energyPerInterval);
        const totalTime = totalIntervals * intervalTime; // Waktu total dalam milidetik.
        const estimatedTime = global.tools.general.convertMsToDuration(totalTime);

        await Promise.all([
            global.db.set(`user.${senderNumber}.onCharger`, true),
            global.db.set(`user.${senderNumber}.lastCharge`, Date.now()),
            global.db.set(`user.${senderNumber}.estimatedTime`, totalTime)
        ]);

        return ctx.reply(quote(`🔌 Sekarang bot akan mengisi energi Anda! Estimasi waktu pengisian penuh: ${estimatedTime}.`));
    }
};