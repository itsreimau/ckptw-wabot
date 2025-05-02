// Impor modul dan dependensi yang diperlukan
const {
    Cooldown,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

// Fungsi untuk mengecek apakah pengguna memiliki cukup koin sebelum menggunakan perintah tertentu
async function checkCoin(requiredCoin, senderId, messageId) {
    const userDb = await db.get(`user.${senderId}`) || {};

    if (tools.general.isOwner(senderId, messageId) || userDb?.premium) return false;
    if ((userDb?.coin || 0) < requiredCoin) return true;

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
        const isOwner = tools.general.isOwner(senderId, ctx.msg.key.id);

        // Mengambil data bot, pengguna, dan grup dari database
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        const muteList = groupDb?.mute || [];

        // Pengecekan mode bot (group, private, self) dan sistem mute
        if ((botDb?.mode === "group" && !isGroup) || (botDb?.mode === "private" && isGroup) || (botDb?.mode === "self" && !isOwner)) return;
        if (groupDb?.mutebot && (!isOwner && !await ctx.group().isSenderAdmin())) return;
        if (muteList.includes(senderId)) return;

        // Menambah XP pengguna dan menangani level-up
        const xpGain = 10;
        const xpToLevelUp = 100;

        let newUserXp = (userDb?.xp || 0) + xpGain;
        if (newUserXp >= xpToLevelUp) {
            let newUserLevel = (userDb?.level || 0) + 1;
            newUserXp -= xpToLevelUp;

            if (userDb?.autolevelup) {
                const profilePictureUrl = await ctx.core.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
                const canvas = tools.api.createUrl("fast", "/canvas/levelup", {
                    avatar: profilePictureUrl,
                    background: config.bot.thumbnail,
                    username: ctx.sender.pushName,
                    currentLevel: userDb?.level,
                    nextLevel: newUserLevel
                });
                const text = `${quote(`Selamat! Kamu telah naik ke level ${newUserLevel}!`)}\n` +
                    `${config.msg.readmore}\n` +
                    quote(tools.cmd.generateNotes([`Terganggu? Ketik ${monospace(`${ctx.used.prefix}setprofile autolevelup`)} untuk menonaktifkan pesan autolevelup.`]));

                try {
                    const url = (await axios.get(tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/img2vid", {
                        url: canvas
                    }))).data.result;
                    await ctx.reply({
                        video: {
                            url
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: text,
                        gifPlayback: true
                    });
                } catch (error) {
                    if (error.status !== 200) await ctx.reply(text);
                }
            }

            await db.set(`user.${senderId}.xp`, newUserXp);
            await db.set(`user.${senderId}.level`, newUserLevel);
        } else {
            await db.set(`user.${senderId}.xp`, newUserXp);
        }

        if (config.system.autoTypingOnCmd) await ctx.simulateTyping(); // Simulasi mengetik jika diaktifkan dalam konfigurasi

        // Pengecekan kondisi pengguna
        const restrictions = [{
                key: "banned",
                condition: userDb?.banned,
                msg: config.msg.banned,
                reaction: "🚫"
            },
            {
                key: "cooldown",
                condition: !isOwner && !userDb?.premium && new Cooldown(ctx, config.system.cooldown).onCooldown,
                msg: config.msg.cooldown,
                reaction: "💤"
            },
            {
                key: "requireBotGroupMembership",
                condition: config.system.requireBotGroupMembership && ctx.used.command !== "botgroup" && !isOwner && !userDb?.premium && !(await ctx.group(config.bot.groupJid).members()).some(member => tools.general.getID(member.id) === senderId),
                msg: config.msg.botGroupMembership,
                reaction: "🚫"
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
                if (!userDb?.hasSentMsg?.[key]) {
                    await ctx.reply(msg);
                    return await db.set(`user.${senderId}.hasSentMsg.${key}`, true);
                } else {
                    return await ctx.react(ctx.id, reaction);
                }
            }
        }

        // Pengecekan izin
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(ctx.used.command));
        if (!command) return next();
        const {
            permissions = {}
        } = command;
        const permissionChecks = [{
                key: "admin",
                condition: isGroup && !await ctx.group().isSenderAdmin(),
                msg: config.msg.admin,
                reaction: "🛡️"
            },
            {
                key: "botAdmin",
                condition: isGroup && !await ctx.group().isBotAdmin(),
                msg: config.msg.botAdmin,
                reaction: "🤖"
            },
            {
                key: "coin",
                condition: permissions.coin && config.system.useCoin && await checkCoin(permissions.coin, senderId, ctx.msg.key.id),
                msg: config.msg.coin,
                reaction: "💰"
            },
            {
                key: "group",
                condition: !isGroup,
                msg: config.msg.group,
                reaction: "👥"
            },
            {
                key: "owner",
                condition: !isOwner,
                msg: config.msg.owner,
                reaction: "👑"
            },
            {
                key: "premium",
                condition: !isOwner && !userDb?.premium,
                msg: config.msg.premium,
                reaction: "💎"
            },
            {
                key: "private",
                condition: isGroup,
                msg: config.msg.private,
                reaction: "📩"
            },
            {
                key: "restrict",
                condition: config.system.restrict,
                msg: config.msg.restrict,
                reaction: "🚫"
            }
        ];

        for (const {
                key,
                condition,
                msg,
                reaction
            }
            of permissionChecks) {
            if (permissions[key] && condition) {
                if (!userDb?.hasSentMsg?.[key]) {
                    await ctx.reply(msg);
                    return await db.set(`user.${senderId}.hasSentMsg.${key}`, true);
                } else if (reaction) {
                    return await ctx.react(ctx.id, reaction);
                }
            }
        }

        await next(); // Lanjut ke proses berikutnya jika semua kondisi pengguna dan izin terpenuhi
    });
};