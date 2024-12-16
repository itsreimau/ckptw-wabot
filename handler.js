const {
    Cooldown
} = require("@mengkodingan/ckptw");

// Penanganan opsi khusus
async function handler(ctx, options) {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJid = ctx.sender.jid;
    const senderId = senderJid.split(/[:@]/)[0];

    const botMode = await db.get("bot.mode");
    if (isPrivate && botMode === "group") return true;
    if (isGroup && botMode === "private") return true;
    if (!tools.general.isOwner(ctx, senderId, true) && botMode === "self") return true;

    const [isOwner, userBanned, userPremium] = await Promise.all([
        tools.general.isOwner(ctx, senderId, config.system.selfOwner),
        db.get(`user.${senderId}.banned`),
        db.get(`user.${senderId}.premium`)
    ]);

    if (config.system.requireBotGroupMembership && !isOwner && !userPremium) {
        const botGroupMembersId = (await ctx.group(config.bot.groupJid).members()).map(member => member.id.split("@")[0]);
        if (!botGroupMembersId.includes(senderId)) {
            await ctx.reply({
                text: config.msg.botGroupMembership,
                contextInfo: {
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.groupLink,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: config.bot.thumbnail,
                        sourceUrl: config.bot.groupLink
                    },
                }
            });
            return true;
        }
    }

    if (userBanned) {
        await ctx.reply(config.msg.banned);
        return true;
    }

    const cooldown = new Cooldown(ctx, config.system.cooldown);
    if (cooldown.onCooldown && !isOwner && !userPremium) {
        await ctx.reply(config.msg.cooldown);
        return true;
    }

    const checkOptions = {
        admin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isAdmin(ctx, senderJid)),
            msg: config.msg.admin
        },
        botAdmin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isBotAdmin(ctx)),
            msg: config.msg.botAdmin
        },
        coin: {
            check: async () => await checkCoin(ctx, options.coin, senderId),
            msg: config.msg.coin
        },
        group: {
            check: async () => !await ctx.isGroup(),
            msg: config.msg.group
        },
        owner: {
            check: () => !isOwner,
            msg: config.msg.owner
        },
        premium: {
            check: () => !isOwner && !userPremium,
            msg: config.msg.premium
        },
        private: {
            check: async () => await ctx.isGroup(),
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
        if (options[option] && typeof check === "function" && await check()) {
            await ctx.reply(msg);
            return true;
        }
    }

    return false;
}

// Cek koin
async function checkCoin(ctx, coinOptions, senderId) {
    const [isOwner, userPremium] = await Promise.all([
        tools.general.isOwner(ctx, senderId, true),
        db.get(`user.${senderId}.premium`)
    ]);

    if (isOwner || userPremium) return false;

    const userCoin = await db.get(`user.${senderId}.coin`) || 0;
    const [requiredCoin = 0, requiredMedia = null, mediaSourceOption = null] = Array.isArray(coinOptions) ? coinOptions : [coinOptions];

    if (requiredMedia) {
        const msgType = ctx.getMessageType();
        let hasMedia = false;

        if (mediaSourceOption === 1 || mediaSourceOption === 3) hasMedia = await tools.general.checkMedia(msgType, requiredMedia, ctx);
        if ((mediaSourceOption === 2 || mediaSourceOption === 3) && ctx.quoted) hasMedia = await tools.general.checkQuotedMedia(ctx.quoted, requiredMedia);

        if (!hasMedia) return false;
    }

    if (userCoin < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}

module.exports = handler;