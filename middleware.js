const {
    Cooldown,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

// Fungsi untuk mengecek apakah pengguna memiliki cukup koin
async function checkCoin(requiredCoin, senderId) {
    const isOwner = tools.general.isOwner(senderId);
    const userDb = await db.get(`user.${senderId}`) || {};

    if (isOwner || userDb?.premium) return false;

    const userCoin = userDb?.coin || 0;
    if (userCoin < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}

// Middleware utama bot
module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;

        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.general.getID(groupJid) : null;

        const isOwner = tools.general.isOwner(senderId);

        // Mengambil basis data
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};
        const botDb = await db.get("bot") || {};

        // Penanganan pada mode bot
        if (isPrivate && botDb.mode === "group") return;
        if (isGroup && botDb.mode === "private") return;
        if (!isOwner && botDb.mode === "self") return;

        // Penanganan mute
        if (groupDb.mute && ctx.used.command !== "unmute") return;

        if (config.system.autoTypingOnCmd) await ctx.simulateTyping(); // Simulasi mengetik jika diaktifkan

        // Cek apakah pengguna diblokir
        if (userDb?.banned) {
            if (!userDb.hasSentMsg?.banned) {
                await ctx.reply(config.msg.banned);
                await db.set(`user.${senderId}.hasSentMsg.banned`, true);
            } else {
                await ctx.react(ctx.id, "🚫");
            }
            return;
        }

        // Sistem cooldown untuk mencegah spam
        const cooldown = new Cooldown(ctx, config.system.cooldown);
        if (cooldown.onCooldown && !isOwner && !userDb?.premium) {
            if (!userDb.hasSentMsg?.cooldown) {
                await ctx.reply(config.msg.cooldown);
                await db.set(`user.${senderId}.hasSentMsg.cooldown`, true);
            } else {
                await ctx.react(ctx.id, "💤");
            }
            return;
        }

        // Cek apakah pengguna wajib menjadi anggota grup bot
        if (config.system.requireBotGroupMembership && ctx.used.command !== "botgroup" && !isOwner && !userDb?.premium) {
            const botGroupMembersId = (await ctx.group(config.bot.groupJid).members()).map(member => tools.general.getID(member.id));
            if (!botGroupMembersId.includes(senderId)) {
                if (!userDb.hasSentMsg?.requireBotGroupMembership) {
                    await ctx.reply(config.msg.botGroupMembership);
                    await db.set(`user.${senderId}.hasSentMsg.requireBotGroupMembership`, true);
                } else {
                    await ctx.react(ctx.id, "🚫");
                }
                return;
            }
        }

        // Cek izin untuk menjalankan perintah tertentu
        const command = [...ctx._config.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(ctx.used.command));
        const permissions = command.permissions || {};

        const checkOptions = {
            admin: {
                check: async () => isGroup && !await ctx.group().isSenderAdmin(),
                msg: config.msg.admin
            },
            botAdmin: {
                check: async () => isGroup && !await ctx.group().isBotAdmin(),
                msg: config.msg.botAdmin
            },
            coin: {
                check: async () => permissions.coin && config.system.useCoin && (await checkCoin(permissions.coin, senderId)),
                msg: config.msg.coin
            },
            group: {
                check: async () => !isGroup,
                msg: config.msg.group
            },
            owner: {
                check: () => !isOwner,
                msg: config.msg.owner
            },
            premium: {
                check: () => !isOwner && !userDb?.premium,
                msg: config.msg.premium
            },
            private: {
                check: async () => isGroup,
                msg: config.msg.private
            },
            restrict: {
                check: () => config.system.restrict,
                msg: config.msg.restrict
            }
        };

        // Loop untuk mengecek semua izin yang diperlukan
        for (const [option, {
                check,
                msg
            }] of Object.entries(checkOptions)) {
            if (permissions[option] && typeof check === "function" && (await check())) {
                await ctx.reply(msg);
                return;
            }
        }

        await next(); // Lanjut ke proses berikutnya jika semua izin terpenuhi
    });
};