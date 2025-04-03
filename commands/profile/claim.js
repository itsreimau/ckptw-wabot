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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "daily"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input === "list") {
            const listText = await tools.list.get("claim");
            return await ctx.reply(listText);
        }

        const senderId = tools.general.getID(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.general.isOwner(senderId) && userDb?.premium) return await ctx.reply(quote("❎ Anda sudah memiliki koin tak terbatas, tidak perlu mengklaim lagi."));

        if (userDb?.level < claimRewards[input].level || 0) return await ctx.reply(quote(`❎ Anda perlu mencapai level ${requiredLevel} untuk mengklaim hadiah ini. Level Anda saat ini adalah ${userDb?.level || 0}.`));

        if (!claimRewards[input]) return await ctx.reply(quote(`❎ Hadiah tidak valid!`));

        const currentTime = Date.now();
        const timePassed = currentTime - userDb?.lastClaim?.[input] || 0;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return await ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input}. Tunggu ${tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const rewardCoin = (userDb?.coin || 0) + claimRewards[input].reward;

            await db.set(`user.${senderId}.coin`, rewardCoin);
            await db.set(`user.${senderId}.lastClaim.${input}`, currentTime);

            return await ctx.reply(quote(`✅ Anda berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Koin saat ini: ${rewardCoin}.`));
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
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