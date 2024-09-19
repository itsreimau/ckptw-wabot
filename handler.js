const {
    Cooldown,
    MessageType
} = require("@mengkodingan/ckptw");

async function handler(ctx, options) {
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.replace(/@.*|:.*/g, "");

    const isOwner = await global.tools.general.isOwner(ctx, senderNumber, true);
    const isPremium = await global.db.get(`user.${senderNumber}.isPremium`);

    const checkOptions = {
        admin: {
            check: async () => !(await ctx.isGroup()) || !(await global.tools.general.isAdmin(ctx, senderJid)),
            msg: global.config.msg.admin
        },
        banned: {
            check: async () => await global.db.get(`user.${senderNumber}.isBanned`),
            msg: global.config.msg.banned
        },
        botAdmin: {
            check: async () => !(await ctx.isGroup()) || !(await global.tools.general.isBotAdmin(ctx)),
            msg: global.config.msg.botAdmin
        },
        charger: {
            check: async () => await global.db.get(`user.${senderNumber}.onCharger`),
            msg: global.config.msg.onCharger
        },
        cooldown: {
            check: async () => new Cooldown(ctx, global.config.system.cooldown).onCooldown,
            msg: global.config.msg.cooldown
        },
        energy: {
            check: async () => await checkEnergy(ctx, options.energy, senderNumber),
            msg: global.config.msg.energy
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
        }] of Object.entries(options)) {
        if (check && await check()) {
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

async function checkEnergy(ctx, energyOptions, senderNumber) {
    if (typeof energyOptions === 'number') {
        const userEnergy = await global.db.get(`user.${senderNumber}.energy`);
        if (userEnergy < energyOptions) return true;

        await global.db.subtract(`user.${senderNumber}.energy`, energyOptions);
        return false;
    }

    const [requiredEnergy, requiredMedia, mediaSourceOption] = Array.isArray(energyOptions) ? energyOptions : [energyOptions || 0];

    const userEnergy = await global.db.get(`user.${senderNumber}.energy`);
    const msgType = ctx.getMessageType();
    let hasMedia = false;

    if (mediaSourceOption === 1 || mediaSourceOption === 3) {
        hasMedia = await checkMedia(msgType, requiredMedia, ctx);
    }

    if ((mediaSourceOption === 2 || mediaSourceOption === 3) && ctx.quoted) {
        hasMedia = await checkQuotedMedia(ctx.quoted, requiredMedia);
    }

    if (requiredMedia && !hasMedia) return false;
    if (userEnergy < requiredEnergy) return true;

    await global.db.subtract(`user.${senderNumber}.energy`, requiredEnergy);
    return false;
}

async function checkMedia(msgType, requiredMedia, ctx) {
    const mediaMap = {
        audio: "audioMessage",
        contact: "contactMessage",
        document: ["documentMessage", "documentWithCaptionMessage"],
        image: "imageMessage",
        location: "locationMessage",
        sticker: "stickerMessage",
        video: "videoMessage",
        text: () => ctx.args.length > 0
    };

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        if (media === "document") {
            return mediaMap[media].includes(msgType);
        } else if (media === "text") {
            return mediaMap[media]();
        }
        return msgType === mediaMap[media];
    });
}

async function checkQuotedMedia(quoted, requiredMedia) {
    const quotedMediaMap = {
        audio: quoted.audioMessage,
        contact: quoted.contactMessage,
        document: quoted.documentMessage || quoted.documentWithCaptionMessage,
        image: quoted.imageMessage,
        location: quoted.locationMessage,
        sticker: quoted.stickerMessage,
        video: quoted.videoMessage,
        text: quoted.conversation || quoted.extendedTextMessage?.text
    };

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        const mediaContent = quotedMediaMap[media];
        if (mediaContent) {
            if (media === "text") {
                return mediaContent.length > 0;
            } else if (quoted.media) {
                return quoted.media.toBuffer().catch(() => null) !== null;
            }
        }
        return false;
    });
}

module.exports = handler;