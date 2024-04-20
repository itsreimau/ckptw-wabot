const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status and message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const checkOptions = {
        admin: {
            function: () => smpl.isAdmin(ctx) === 0,
            msg: global.msg.admin
        },
        botAdmin: {
            function: () => smpl.isAdminOf(ctx) === 0,
            msg: global.msg.botAdmin
        },
        group: {
            function: () => smpl.isGroup(ctx) === 0,
            msg: global.msg.group
        },
        owner: {
            function: () => smpl.isOwner(ctx) === 0,
            msg: global.msg.owner
        },
        private: {
            function: () => smpl.isPrivate(ctx) === 0,
            msg: global.msg.private
        }
    };

    let status = false;
    let message = null;

    for (const option of Object.keys(options)) {
        const checkOption = checkOptions[option];
        if (checkOption.function()) {
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