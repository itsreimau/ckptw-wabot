const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "claim",
    category: "profile",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "daily"))}\n` +
            quote(global.tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("claim");
            return await ctx.reply(listText);
        }

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const userLevel = global.db.get(`user.${senderNumber}.level`) || 0;

        if (input === "premium") {
            if (userLevel <= 100) return await ctx.reply(quote(`❎ Anda harus memiliki level lebih dari 100 untuk mengklaim status premium. Level Anda saat ini adalah ${userLevel}.`));

            const isPremium = global.db.get(`user.${senderNumber}.isPremium`) || false;
            if (isPremium) return await ctx.reply(quote(`❎ Anda sudah memiliki Premium.`));

            await global.db.set(`user.${senderNumber}.isPremium`, true);
            return await ctx.reply(quote(`🎉 Selamat! Anda telah berhasil mengklaim Premium!`));
        }

        if (!claimRewards[input]) return await ctx.reply(quote(`❎ Teks tidak valid.`));

        const requiredLevel = claimRewards[input].level || 0;

        if (userLevel < requiredLevel) return await ctx.reply(quote(`❎ Anda perlu mencapai level ${requiredLevel} untuk mengklaim hadiah ini. Level Anda saat ini adalah ${userLevel}.`));

        const lastClaimTime = global.db.get(`user.${senderNumber}.lastClaim.${input}`) || 0;
        const currentTime = Date.now();
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return await ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input} Anda. Harap tunggu ${global.tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        const [isOwner, isPremium] = await Promise.all([
            global.tools.general.isOwner(ctx, senderNumber, true),
            global.db.get(`user.${senderNumber}.isPremium`)
        ]);

        if (isPremium || isOwner) return await ctx.reply(quote("❎ Koin Anda tidak terbatas sehingga tidak perlu mengklaim koin lagi."));

        try {
            const userKey = `user.${senderNumber}.coin`;
            const currentCoins = global.db.get(userKey) || 0;
            const newBalance = currentCoins + claimRewards[input].reward;

            await Promise.all([
                global.db.set(userKey, newBalance),
                global.db.set(`user.${senderNumber}.lastClaim.${input}`, currentTime)
            ]);

            return await ctx.reply(quote(`✅ Anda telah berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Sekarang Anda memiliki koin ${newBalance}.`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Dapat diubah sesuai keinginan Anda
const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000, // 24 jam (100 koin)
        level: 1 // Level 1 untuk klaim daily
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000, // 7 hari (500 koin)
        level: 15 // Level 15 untuk klaim weekly
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000, // 30 hari (2000 koin)
        level: 50 // Level 50 untuk klaim monthly
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000, // 365 hari (10000 koin)
        level: 75 // Level 75 untuk klaim yearly
    }
};