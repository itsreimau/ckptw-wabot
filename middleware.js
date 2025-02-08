// Import modul dan dependensi
const {
    Cooldown,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

// Fungsi untuk mengecek apakah pengguna memiliki cukup koin
async function checkCoin(requiredCoin, senderId) {
    const userDb = await db.get(`user.${senderId}`) || {};

    if (tools.general.isOwner(senderId) || userDb.premium) return false;
    if ((userDb.coin || 0) < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}

// Middleware utama bot
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.general.getID(groupJid) : null;
        const isOwner = tools.general.isOwner(senderId);

        // Mengambil basis data
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        if ((botDb.mode === "group" && !isGroup) || (botDb.mode === "private" && isGroup) || (botDb.mode === "self" && !isOwner)) return; // Mode bot (group, private, self)

        if (groupDb.mute && ctx.used.command !== "unmute") return; // Mode mute pada grup

        if (config.system.autoTypingOnCmd) await ctx.simulateTyping(); // Simulasi mengetik jika diaktifkan

        // Penanganan XP & Level untuk pengguna
        const xpGain = 10;
        const xpToLevelUp = 100;

        let newUserXp = (userDb?.xp || 0) + xpGain;
        if (newUserXp >= xpToLevelUp) {
            let newUserLevel = (userDb?.level || 0) + 1;
            newUserXp -= xpToLevelUp;

            const profilePictureUrl = await ctx.core.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            if (userDb?.autolevelup) await ctx.reply({
                text: `${quote(`Selamat! Kamu telah naik ke level ${newUserLevel}!`)}\n` +
                    `${config.msg.readmore}\n` +
                    quote(tools.msg.generateNotes([`Terganggu? Ketik ${monospace(`${ctx.used.prefix}setprofile autolevelup`)} untuk menonaktifkan pesan autolevelup.`])),
                contextInfo: {
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profilePictureUrl || config.bot.thumbnail,
                        sourceUrl: config.bot.website
                    }
                }
            });

            await db.set(`user.${senderId}.xp`, newUserXp);
            await db.set(`user.${senderId}.level`, newUserLevel);
        } else {
            await db.set(`user.${senderId}.xp`, newUserXp);
        }

        // Pengecekan pengguna (banned, cooldown, keanggotaan grup bot)
        const restrictions = [{
                condition: userDb.banned,
                msg: config.msg.banned,
                reaction: "🚫",
                key: "banned",
            },
            {
                condition: !isOwner && !userDb.premium && new Cooldown(ctx, config.system.cooldown).onCooldown,
                msg: config.msg.cooldown,
                reaction: "💤",
                key: "cooldown",
            },
            {
                condition: config.system.requireBotGroupMembership && ctx.used.command !== "botgroup" && !isOwner && !userDb.premium && !(await ctx.group(config.bot.groupJid).members()).some(member => tools.general.getID(member.id) === senderId),
                msg: config.msg.botGroupMembership,
                reaction: "🚫",
                key: "requireBotGroupMembership",
            }
        ];

        for (const {
                condition,
                msg,
                reaction,
                key
            }
            of restrictions) {
            if (condition) {
                if (!userDb.hasSentMsg?.[key]) {
                    await ctx.reply(msg);
                    await db.set(`user.${senderId}.hasSentMsg.${key}`, true);
                } else {
                    await ctx.react(ctx.id, reaction);
                }
                return;
            }
        }

        // Pengecekan izin command
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(ctx.used.command));
        if (!command) return next(); // Jika tidak ada command yang cocok, lanjutkan

        const {
            permissions = {}
        } = command;
        const permissionChecks = [{
                key: "admin",
                condition: isGroup && !await ctx.group().isSenderAdmin(),
                msg: config.msg.admin,
            },
            {
                key: "botAdmin",
                condition: isGroup && !await ctx.group().isBotAdmin(),
                msg: config.msg.botAdmin,
            },
            {
                key: "coin",
                condition: permissions.coin && config.system.useCoin && await checkCoin(permissions.coin, senderId),
                msg: config.msg.coin,
            },
            {
                key: "group",
                condition: !isGroup,
                msg: config.msg.group,
            },
            {
                key: "owner",
                condition: !isOwner,
                msg: config.msg.owner,
            },
            {
                key: "premium",
                condition: !isOwner && !userDb.premium,
                msg: config.msg.premium,
            },
            {
                key: "private",
                condition: isGroup,
                msg: config.msg.private,
            },
            {
                key: "restrict",
                condition: config.system.restrict,
                msg: config.msg.restrict,
            }
        ];

        for (const {
                key,
                condition,
                msg
            }
            of permissionChecks) {
            if (permissions[key] && condition) {
                await ctx.reply(msg);
                return;
            }
        }

        await next(); // Lanjut ke proses berikutnya jika semua izin terpenuhi
    });
};