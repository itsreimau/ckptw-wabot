const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "claim",
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "daily"))
        );

        if (!claimRewards[input]) return ctx.reply(quote(`❎ Jenis klaim tidak valid. Silakan pilih salah satu dari berikut ini: daily, weekly, monthly, atau yearly.`));

        const senderJid = ctx.sender.jid.split("@")[0];
        const lastClaimTime = global.db.get(`user.${senderJid}.lastClaim.${input}`) || 0;
        const currentTime = Date.now();
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input} Anda. Harap tunggu ${general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const userKey = `user.${senderJid}.coin`;
            const currentCoins = global.db.get(userKey) || 0;
            const newBalance = currentCoins + claimRewards[input].reward;

            global.db.set(userKey, newBalance);
            global.db.set(`user.${senderJid}.lastClaim.${input}`, currentTime);

            return ctx.reply(quote(`✅ Anda telah berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Saldo baru Anda adalah ${newBalance} koin.`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000 // 24 jam.
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000 // 7 hari.
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000 // 30 hari.
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000 // 365 hari.
    }
};