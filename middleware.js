// Import modul dan dependensi
const {
    Cooldown
} = require("@mengkodingan/ckptw");

// Fungsi untuk mengecek apakah pengguna memiliki cukup koin
async function checkCoin(requiredCoin, senderId) {
    const {
        isOwner
    } = tools.general;
    const userDb = await db.get(`user.${senderId}`) || {};

    if (isOwner(senderId) || userDb.premium) return false;
    if ((userDb.coin || 0) < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}

// Middleware utama bot
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        const {
            isGroup,
            sender,
            used,
            group,
            react,
            reply,
            simulateTyping
        } = ctx;
        const senderId = tools.general.getID(sender.jid);
        const isOwner = tools.general.isOwner(senderId);

        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = isGroup ? (await db.get(`group.${ctx.id}`) || {}) : {};
        const botDb = await db.get("bot") || {};

        if ((botDb.mode === "group" && !isGroup) || (botDb.mode === "private" && isGroup) || (botDb.mode === "self" && !isOwner)) return; // Mode bot (group, private, self)

        if (groupDb.mute && used.command !== "unmute") return; // Mode mute pada grup

        if (config.system.autoTypingOnCmd) await simulateTyping(); // Simulasi mengetik jika diaktifkan

        // Pengecekan pengguna (banned, cooldown, keanggotaan grup bot)
        const restrictions = {
            banned: {
                check: userDb.banned,
                msg: config.msg.banned,
                reaction: "🚫"
            },
            cooldown: {
                check: !isOwner && !userDb.premium && new Cooldown(ctx, config.system.cooldown).onCooldown,
                msg: config.msg.cooldown,
                reaction: "💤"
            },
            requireBotGroupMembership: {
                check: config.system.requireBotGroupMembership && used.command !== "botgroup" && !isOwner && !userDb.premium && !(await group(config.bot.groupJid).members()).some(member => tools.general.getID(member.id) === senderId),
                msg: config.msg.botGroupMembership,
                reaction: "🚫"
            }
        };

        for (const [key, {
                check,
                msg,
                reaction
            }] of Object.entries(restrictions)) {
            if (check) {
                if (!userDb.hasSentMsg?.[key]) {
                    await reply(msg);
                    await db.set(`user.${senderId}.hasSentMsg.${key}`, true);
                } else {
                    await react(ctx.id, reaction);
                }
                return;
            }
        }

        // Pengecekan izin command
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(used.command));
        const {
            permissions = {}
        } = command || {};

        const permissionChecks = {
            admin: {
                check: isGroup && !(await group().isSenderAdmin()),
                msg: config.msg.admin
            },
            botAdmin: {
                check: isGroup && !(await group().isBotAdmin()),
                msg: config.msg.botAdmin
            },
            coin: {
                check: permissions.coin && config.system.useCoin && (await checkCoin(permissions.coin, senderId)),
                msg: config.msg.coin
            },
            group: {
                check: !isGroup,
                msg: config.msg.group
            },
            owner: {
                check: !isOwner,
                msg: config.msg.owner
            },
            premium: {
                check: !isOwner && !userDb.premium,
                msg: config.msg.premium
            },
            private: {
                check: isGroup,
                msg: config.msg.private
            },
            restrict: {
                check: config.system.restrict,
                msg: config.msg.restrict
            }
        };

        for (const [key, {
                check,
                msg
            }] of Object.entries(permissionChecks)) {
            if (permissions[key] && check) {
                await reply(msg);
                return;
            }
        }

        await next(); // Lanjut ke proses berikutnya jika semua izin terpenuhi
    });
};