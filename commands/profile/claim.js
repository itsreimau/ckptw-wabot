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
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "daily"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const [userLevel, isPremium, lastClaimFreetrial, lastClaim, currentCoins] = await Promise.all([
            db.get(`user.${senderNumber}.level`) || 0,
            db.get(`user.${senderNumber}.isPremium`) || false,
            db.get(`user.${senderNumber}.lastClaim.freetrial`) || null,
            db.get(`user.${senderNumber}.lastClaim`) || {},
            db.get(`user.${senderNumber}.coin`) || 0
        ]);

        if (input === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply(listText);
        }

        if (input === "premium") {
            if (userLevel <= 100) return await ctx.reply(quote(`❎ Anda harus memiliki level lebih dari 100 untuk mengklaim status premium. Level Anda saat ini adalah ${userLevel}.`));
            if (isPremium === true) return await ctx.reply(quote(`❎ Anda sudah memiliki Premium.`));

            await db.set(`user.${senderNumber}.isPremium`, true);
            return await ctx.reply(quote(`🎉 Selamat! Anda telah berhasil mengklaim Premium!`));
        }

        if (input === "freetrial") {
            const trialPeriod = 7 * 24 * 60 * 60 * 1000;
            const currentTime = Date.now();

            if (lastClaimFreetrial === "expired") return await ctx.reply(quote(`❎ Free Trial hanya bisa diambil satu kali per pengguna. Jika Anda ingin mendapatkan akses Premium, silakan hubungi Owner.`));
            if (lastClaimFreetrial && (currentTime - lastClaimFreetrial < trialPeriod)) return await ctx.reply(quote(`❎ Anda sebelumnya telah mengklaim Free Trial dan masa berlakunya belum habis.`));
            if (isPremium === true) return await ctx.reply(quote(`❎ Anda sudah memiliki Premium.`));

            await Promise.all([
                db.set(`user.${senderNumber}.isPremium`, "freetrial"),
                db.set(`user.${senderNumber}.lastClaim.freetrial`, currentTime)
            ]);

            return await ctx.reply(quote(`🎉 Selamat! Anda telah berhasil mengklaim Free Trial Premium selama 7 hari!`));
        }

        if (!claimRewards[input]) return await ctx.reply(quote(`❎ Teks tidak valid.`));

        const requiredLevel = claimRewards[input].level || 0;
        if (userLevel < requiredLevel) return await ctx.reply(quote(`❎ Anda perlu mencapai level ${requiredLevel} untuk mengklaim hadiah ini. Level Anda saat ini adalah ${userLevel}.`));

        const lastClaimTime = lastClaim[input] || 0;
        const currentTime = Date.now();
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return await ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input}. Tunggu ${tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));
        if (isPremium === true) return await ctx.reply(quote("❎ Anda sudah memiliki koin tak terbatas, tidak perlu mengklaim lagi."));

        try {
            const newBalance = currentCoins + claimRewards[input].reward;

            await Promise.all([
                db.set(`user.${senderNumber}.coin`, newBalance),
                db.set(`user.${senderNumber}.lastClaim.${input}`, currentTime)
            ]);

            return await ctx.reply(quote(`✅ Anda berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Koin saat ini: ${newBalance}.`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
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