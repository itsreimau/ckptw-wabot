const {
    Cooldown,
    MessageType
} = require("@mengkodingan/ckptw");

async function handler(ctx, options) {
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.replace(/@.*|:.*/g, "");

    const [isOwner, isPremium] = await Promise.all([
        global.tools.general.isOwner(ctx, senderNumber, true),
        global.db.get(`user.${senderNumber}.isPremium`)
    ]);

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
            check: () => {
                console.log("Checking owner:", isOwner);
                return !isOwner;
            },
            msg: global.config.msg.owner
        },
        premium: {
            check: () => {
                console.log("Checking premium:", isOwner, isPremium);
                return !isOwner && !isPremium;
            },
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
        const result = await check();
        console.log(`Option: ${option}, Result: ${result}`);

        if (result) {
            console.log(`Option ${option} triggered with message: ${msg}`);
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