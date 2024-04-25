const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status and message if applicable, otherwise null.
 */
exports.handler = async (ctx, options) => {
    const checkOptions = {
        admin: {
            function: async () => await smpl.isAdmin(ctx) === 0,
            msg: global.msg.admin
        },
        banned: {
            function: async () => await global.db.get(`user.${ctx._sender.jid.split('@')[0])}.isBanned`),
            msg: global.msg.banned
        },
        botAdmin: {
            function: async () => await smpl.isAdminOf(ctx) === 0,
            msg: global.msg.botAdmin
        },
        group: {
            function: async () => await !ctx.isGroup(),
            msg: global.msg.group
        },
        owner: {
            function: async () => await smpl.isOwner(ctx) === 0,
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