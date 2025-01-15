const {
    Cooldown
} = require("@mengkodingan/ckptw");

// Penanganan opsi khusus
async function handler(ctx, options) {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJid = ctx.sender.jid;
    const senderId = senderJid.split(/[:@]/)[0];

    const botMode = await db.get("bot.mode") || "public";
    if (isPrivate && botMode === "group") return true;
    if (isGroup && botMode === "private") return true;
    if (!tools.general.isOwner(senderId, true) && botMode === "self") return true;

    const isOwner = tools.general.isOwner(senderId);
    const userDb = await db.get(`user.${senderId}`) || {};

    if (config.system.requireBotGroupMembership && !isOwner && !userDb?.premium) {
        const botGroupMembersId = (await ctx.group()(config.bot.groupJid).members()).map(member => member.id.split("@")[0]);
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

    if (userDb?.banned) {
        await ctx.reply(config.msg.banned);
        return true;
    }

    const cooldown = new Cooldown(ctx, config.system.cooldown);
    if (cooldown.onCooldown && !isOwner && !userDb?.premium) {
        await ctx.reply(config.msg.cooldown);
        return true;
    }

    const checkOptions = {
        admin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isAdmin(ctx.group(), senderJid)),
            msg: config.msg.admin
        },
        botAdmin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isBotAdmin(ctx.group())),
            msg: config.msg.botAdmin
        },
        coin: {
            check: async () => await checkCoin(options.coin, senderId) && config.system.useCoin,
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
            check: () => !isOwner && !userDb?.premium,
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
async function checkCoin(requiredCoin, senderId) {
    const isOwner = tools.general.isOwner(senderId);
    const userDb = await db.get(`user.${senderId}`) || {};

    if (isOwner || userDb?.premium) return false;

    const userCoin = userDb?.coin || 0;

    if (userCoin < requiredCoin) return true;

    await db.subtract(`user.${senderId}.coin`, requiredCoin);
    return false;
}


module.exports = handler;