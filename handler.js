const smpl = require('./tools/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status and message if applicable, otherwise null.
 */
exports.handler = async (ctx, options) => {
    const senderNumber = ctx._sender.jid.split('@')[0];

    const checkOptions = {
        admin: {
            function: async () => await ctx.isGroup() ? await smpl.isAdmin(ctx) === 0 : null,
            msg: global.msg.admin
        },
        banned: {
            function: async () => await global.db.fetch(`user.${senderNumber}.isBanned`),
            msg: global.msg.banned
        },
        botAdmin: {
            function: async () => await ctx.isGroup() ? await smpl.isBotAdmin(ctx) === 0 : null,
            msg: global.msg.botAdmin
        },
        coin: {
            function: async () => {
                const userCoin = await global.db.fetch(`user.${senderNumber}.coin`);
                if (userCoin === undefined) await global.db.add(`user.${senderNumber}.coin`, 10);

                if (!ctx._args.length) return false;

                if (await smpl.isOwner(senderNumber) === 1) return false;

                if (userCoin < options.coin) return true;

                await global.db.subtract(`user.${senderNumber}.coin`, options.coin);
                return false;
            },
            msg: global.msg.coin
        },
        group: {
            function: async () => await !ctx.isGroup(),
            msg: global.msg.group
        },
        owner: {
            function: async () => await smpl.isOwner(senderNumber) === 0,
            msg: global.msg.owner
        },
        private: {
            function: async () => await ctx.isGroup(),
            msg: global.msg.private
        }
    };

    let status = false;
    let message = null;

    for (const option of Object.keys(options)) {
        const checkOption = checkOptions[option];
        if (await checkOption.function()) {
            status = true;
            message = checkOption.msg;
            break;
        }
    }

    return {
        status,
        message
    };
}