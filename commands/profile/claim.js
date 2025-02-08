const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "claim",
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "daily"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        const senderId = tools.general.getID(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (input === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply(listText);
        }

        if (!claimRewards[input]) return await ctx.reply(quote(`❎ Hadiah tidak valid!`));

        if (tools.general.isOwner(senderId) && userDb?.premium) return await ctx.reply(quote("❎ Anda sudah memiliki koin tak terbatas, tidak perlu mengklaim lagi."));

        const requiredLevel = claimRewards[input].level || 0;
        if (userDb?.level < requiredLevel) return await ctx.reply(quote(`❎ Anda perlu mencapai level ${requiredLevel} untuk mengklaim hadiah ini. Level Anda saat ini adalah ${userDb?.level || 0}.`));

        const lastClaimTime = userDb?.lastClaim?.[input] || 0;
        const currentTime = Date.now();
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return await ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input}. Tunggu ${tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const rewardCoin = (userDb?.coin || 0) + claimRewards[input].reward;

            await Promise.all([
                db.set(`user.${senderId}.coin`, rewardCoin),
                db.set(`user.${senderId}.lastClaim.${input}`, currentTime)
            ]);

            return await ctx.reply(quote(`✅ Anda berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Koin saat ini: ${rewardCoin}.`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Daftar hadiah klaim yang tersedia (Dapat diubah sesuai keinginan Anda)
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