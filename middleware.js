// Impor modul dan dependensi yang diperlukan
const {
    Cooldown,
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

// Fungsi untuk mengecek apakah pengguna memiliki cukup koin sebelum menggunakan perintah tertentu
async function checkCoin(requiredCoin, userDb, senderId, isOwner) {
    if (isOwner || userDb?.premium) return false;
    if (userDb?.coin < requiredCoin) return true;
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
        const senderId = tools.cmd.getID(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.cmd.getID(groupJid) : null;
        const isOwner = tools.cmd.isOwner(senderId, ctx.msg.key.id);

        // Mengambil data bot, pengguna, dan grup dari database
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};
        const muteList = groupDb?.mute || [];

        // Pengecekan mode bot (group, private, self) dan sistem mute
        if ((botDb?.mode === "group" && isPrivate) || (botDb?.mode === "private" && isGroup) || (botDb?.mode === "self" && !isOwner)) return;
        if ((groupDb?.mutebot === true && (!isOwner && !await ctx.group().isSenderAdmin())) || (groupDb?.mutebot === "owner" && !isOwner)) return;
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
                const canvas = tools.api.createUrl("siputzx", "/api/canvas/level-up", {
                    backgroundURL: config.bot.thumbnail,
                    avatarURL: profilePictureUrl,
                    fromLevel: userDb?.level,
                    toLevel: newUserLevel,
                    name: ctx.sender.pushName
                });

                await ctx.reply({
                    text: `${quote(`Selamat! Anda telah naik ke level ${newUserLevel}!`)}\n` +
                        `${config.msg.readmore}\n` +
                        quote(tools.msg.generateNotes([`Terganggu? Ketik ${monospace(`${ctx.used.prefix}setprofile autolevelup`)} untuk menonaktifkan pesan autolevelup.`])),
                    contextInfo: {
                        externalAdReply: {
                            title: config.bot.name,
                            body: config.bot.note,
                            mediaType: 1,
                            thumbnail: await tools.cmd.fillImageWithBlur(canvas),
                            renderLargerThumbnail: true
                        }
                    }
                });
            }

            await db.set(`user.${senderId}.xp`, newUserXp);
            await db.set(`user.${senderId}.level`, newUserLevel);
        } else {
            await db.set(`user.${senderId}.xp`, newUserXp);
        }

        // Simulasi mengetik jika diaktifkan dalam konfigurasi
        const simulateTyping = async () => {
            if (config.system.autoTypingOnCmd) await ctx.simulateTyping();
        };

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
                condition: config.system.requireBotGroupMembership && ctx.used.command !== "botgroup" && !isOwner && !userDb?.premium && !(await ctx.group(config.bot.groupJid).members()).some(member => tools.cmd.getID(member.id) === senderId),
                msg: config.msg.botGroupMembership,
                reaction: "🚫"
            },
            {
                key: "gamerestrict",
                condition: groupDb?.option?.gamerestrict && ctx.bot.cmd.has(ctx.used.command) && ctx.bot.cmd.get(ctx.used.command).category === "game",
                msg: config.msg.gamerestrict,
                reaction: "🎮"
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
                const now = Date.now();
                const lastSentMsg = userDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;

                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    await simulateTyping();
                    await ctx.reply(
                        `${msg}\n` +
                        `${config.msg.readmore}\n` +
                        quote(tools.msg.generateNotes([`Respon selanjutnya akan berupa reaksi emoji '${reaction}'.`]))
                    );
                    return await db.set(`user.${senderId}.lastSentMsg.${key}`, now);
                } else {
                    return await ctx.react(ctx.id, reaction);
                }
            }
        }

        // Pengecekan kondisi perizinan
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(ctx.used.command));
        if (!command) return await next();
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
                condition: permissions.coin && config.system.useCoin && await checkCoin(permissions.coin, userDb, senderId, isOwner),
                msg: config.msg.coin,
                reaction: "💰"
            },
            {
                key: "group",
                condition: isPrivate,
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
                const now = Date.now();
                const lastSentMsg = userDb?.lastSentMsg?.[key] || 0;
                const oneDay = 24 * 60 * 60 * 1000;

                if (!lastSentMsg || (now - lastSentMsg) > oneDay) {
                    await simulateTyping();
                    await ctx.reply(
                        `${msg}\n` +
                        `${config.msg.readmore}\n` +
                        quote(tools.msg.generateNotes([`Respon selanjutnya akan berupa reaksi emoji '${reaction}'.`]))
                    );
                    return await db.set(`user.${senderId}.lastSentMsg.${key}`, now);
                } else {
                    return await ctx.react(ctx.id, reaction);
                }
            }
        }

        await simulateTyping();
        await next(); // Lanjut ke proses berikutnya jika semua kondisi terpenuhi
    });
};