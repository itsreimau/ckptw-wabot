const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    jidDecode,
    jidEncode
} = require("@whiskeysockets/baileys");

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
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "daily"))}\n` +
            quote(global.tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("claim");
            return ctx.reply(listText);
        }

        if (!claimRewards[input]) return ctx.reply(quote(`❎ Teks tidak valid.`));

        const senderJidDecode = jidDecode(ctx.sender.jid);
        const senderJid = jidEncode(senderJidDecode.user, senderJidDecode.server);
        const senderNumber = senderJidDecode.user;
        const lastClaimTime = global.db.get(`user.${senderJid}.lastClaim.${input}`) || 0;
        const currentTime = Date.now();
        const timePassed = currentTime - lastClaimTime;
        const remainingTime = claimRewards[input].cooldown - timePassed;

        if (remainingTime > 0) return ctx.reply(quote(`⏳ Anda telah mengklaim hadiah ${input} Anda. Harap tunggu ${global.tools.general.convertMsToDuration(remainingTime)} untuk mengklaim lagi.`));

        try {
            const userKey = `user.${senderJid}.coin`;
            const currentCoins = global.db.get(userKey) || 0;
            const newBalance = currentCoins + claimRewards[input].reward;

            await Promise.all([
                global.db.set(userKey, newBalance),
                global.db.set(`user.${senderJid}.lastClaim.${input}`, currentTime)
            ]);

            return ctx.reply(quote(`✅ Anda telah berhasil mengklaim hadiah ${input} sebesar ${claimRewards[input].reward} koin! Sekarang Anda memiliki koin ${newBalance}.`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Dapat diubah sesuai keinginan Anda
const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000 // 24 jam (100 koin)
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000 // 7 hari (500 koin)
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000 // 30 hari (2000 koin)
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000 // 365 hari (10000 koin)
    }
};