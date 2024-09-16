const {
    Cooldown
} = require("@mengkodingan/ckptw");

async function handler(ctx, options) {
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.replace(/@.*|:.*/g, "");

    const isOwner = await global.tools.general.isOwner(ctx, senderNumber, true);
    const isPremium = await global.db.get(`user.${senderNumber}.isPremium`);

    const checkOptions = {
        admin: {
            function: async () => ctx.isGroup() && !await global.tools.general.isAdmin(ctx, senderJid),
            msg: global.config.msg.admin
        },
        banned: {
            function: async () => await global.db.get(`user.${senderNumber}.isBanned`),
            msg: global.config.msg.banned
        },
        botAdmin: {
            function: async () => ctx.isGroup() && !await global.tools.general.isBotAdmin(ctx),
            msg: global.config.msg.botAdmin
        },
        charger: {
            function: async () => await global.db.get(`user.${senderNumber}.onCharger`),
            msg: global.config.msg.onCharger
        },
        cooldown: {
            function: async () => new Cooldown(ctx, global.config.system.cooldown).onCooldown,
            msg: global.config.msg.cooldown
        },
        energy: {
            function: async () => {
                if (isOwner || isPremium) {
                    return false;
                }

                const userEnergy = await global.db.get(`user.${senderNumber}.energy`);
                const requiredEnergy = options.energy || 0;

                if (userEnergy < requiredEnergy) {
                    return true;
                }

                await global.db.subtract(`user.${senderNumber}.energy`, requiredEnergy);
                return false;
            },
            msg: global.config.msg.energy
        },
        group: {
            function: async () => !await ctx.isGroup(),
            msg: global.config.msg.group
        },
        owner: {
            function: async () => !isOwner,
            msg: global.config.msg.owner
        },
        premium: {
            function: async () => !isOwner && !isPremium,
            msg: global.config.msg.premium
        },
        private: {
            function: async () => await ctx.isGroup(),
            msg: global.config.msg.private
        },
        restrict: {
            function: () => global.config.system.restrict,
            msg: global.config.msg.restrict
        }
    };

    for (const [option, checkOption] of Object.entries(options)) {
        const {
            function: checkFunction,
            msg
        } = checkOptions[option] || {};
        if (checkFunction && await checkFunction()) {
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

module.exports = handler;