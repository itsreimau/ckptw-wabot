const {
    Cooldown
} = require("@mengkodingan/ckptw");

async function checkCoin(requiredCoin, senderId) {
    const isOwner = tools.general.isOwner(senderId);
    const userDb = await db.get(`user.${senderId}`) || {};

    if (isOwner || userDb?.premium) return false;

    const userCoin = userDb?.coin || 0;
    if (userCoin < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}

module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;
        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];

        const botMode = await db.get("bot.mode") || "public";
        if (isPrivate && botMode === "group") return;
        if (isGroup && botMode === "private") return;
        if (!tools.general.isOwner(senderId, true) && botMode === "self") return;

        if (!ctx._used?.command) return await next();

        const isOwner = tools.general.isOwner(senderId);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (userDb?.banned) {
            if (!userDb.hasSentMsg?.banned) {
                await ctx.reply(config.msg.banned);
                await db.set(`user.${senderId}.hasSentMsg.banned`, true);
            } else {
                await ctx.react("🚫");
            }
            return;
        }

        const cooldown = new Cooldown(ctx, config.system.cooldown);
        if (cooldown.onCooldown && !isOwner && !userDb?.premium) {
            if (!userDb.hasSentMsg?.cooldown) {
                await ctx.reply(config.msg.cooldown);
                await db.set(`user.${senderId}.hasSentMsg.cooldown`, true);
            } else {
                await ctx.react("💤");
            }
            return;
        }

        if (config.system.requireBotGroupMembership && ctx._used.command !== "botgroup" && !isOwner && !userDb?.premium) {
            const botGroupMembersId = (await ctx.group()(config.bot.groupJid).members()).map(member => member.id.split("@")[0]);
            if (!botGroupMembersId.includes(senderId)) {
                if (!userDb.hasSentMsg?.requireBotGroupMembership) {
                    await ctx.reply(config.msg.botGroupMembership);
                    await db.set(`user.${senderId}.hasSentMsg.requireBotGroupMembership`, true);
                } else {
                    await ctx.react("🚫");
                }
                return;
            }
        }

        const command = [...ctx._config.cmd.values()].find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(ctx._used.name));
        if (!command) return await next();

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

        for (const [option, {
                check,
                msg
            }] of Object.entries(checkOptions)) {
            if (permissions[option] && typeof check === "function" && (await check())) {
                await ctx.reply(msg);
                return;
            }
        }

        await next();
    });
};