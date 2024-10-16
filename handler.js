const {
    Cooldown
} = require("@mengkodingan/ckptw");

async function handler(ctx, options) {
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.split(/[:@]/)[0];

    const [isOwner, isPremium] = await Promise.all([
        global.tools.general.isOwner(ctx, senderNumber, true),
        global.db.get(`user.${senderNumber}.isPremium`)
    ]);

    const checkOptions = {
        admin: {
            check: async () => (await ctx.isGroup()) && !(await global.tools.general.isAdmin(ctx, senderJid)),
            msg: global.config.msg.admin
        },
        banned: {
            check: async () => await global.db.get(`user.${senderNumber}.isBanned`),
            msg: global.config.msg.banned
        },
        botAdmin: {
            check: async () => (await ctx.isGroup()) && !(await global.tools.general.isBotAdmin(ctx)),
            msg: global.config.msg.botAdmin
        },
        cooldown: {
            check: async () => new Cooldown(ctx, global.config.system.cooldown).onCooldown,
            msg: global.config.msg.cooldown
        },
        coin: {
            check: async () => await checkCoin(ctx, options.coin, senderNumber),
            msg: global.config.msg.coin
        },
        group: {
            check: async () => !(await ctx.isGroup()),
            msg: global.config.msg.group
        },
        owner: {
            check: () => !isOwner,
            msg: global.config.msg.owner
        },
        premium: {
            check: () => !isOwner && !isPremium,
            msg: global.config.msg.premium
        },
        private: {
            check: async () => await ctx.isGroup(),
            msg: global.config.msg.private
        },
        restrict: {
            check: () => global.config.system.restrict,
            msg: global.config.msg.restrict
        }
    };

    for (const [option, {
            check,
            msg
        }] of Object.entries(checkOptions)) {
        if (options[option] && typeof check === "function" && await check()) {
            return {
                status: true,
                message: msg
            };
        }
    }

    return {
        status: false,
        message: null
    };
}

async function checkCoin(ctx, coinOptions, senderNumber) {
    const [isOwner, isPremium] = await Promise.all([
        global.tools.general.isOwner(ctx, senderNumber, true),
        global.db.get(`user.${senderNumber}.isPremium`)
    ]);

    if (isOwner || isPremium) return false;

    if (typeof coinOptions === "number") {
        const userCoin = await global.db.get(`user.${senderNumber}.coin`) || 0;
        if (userCoin < coinOptions) return true;

        await global.db.subtract(`user.${senderNumber}.coin`, coinOptions);
        return false;
    }

    const [requiredCoin, requiredMedia, mediaSourceOption] = Array.isArray(coinOptions) ? coinOptions : [coinOptions || 0];
    const userCoin = await global.db.get(`user.${senderNumber}.coin`) || 0;
    const msgType = ctx.getMessageType();
    let hasMedia = false;

    if (mediaSourceOption === 1 || mediaSourceOption === 3) hasMedia = await global.tools.general.checkMedia(msgType, requiredMedia, ctx);
    if ((mediaSourceOption === 2 || mediaSourceOption === 3) && ctx.quoted) hasMedia = await global.tools.general.checkQuotedMedia(ctx.quoted, requiredMedia);

    if (requiredMedia && !hasMedia) return false;

    if (userCoin < requiredCoin) return true;

    await global.db.subtract(`user.${senderNumber}.coin`, requiredCoin);

    return false;
}

module.exports = handler;
