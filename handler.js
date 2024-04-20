const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status, option, and message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const checkFunctions = {
        admin: () => smpl.isAdmin(ctx) === 0,
        botAdmin: () => smpl.isAdminOf(ctx) === 0,
        group: () => smpl.isGroup(ctx) === 0,
        owner: () => smpl.isOwner(ctx) === 0,
        private: () => smpl.isPrivate(ctx) === 0
    };

    const validOptions = [];

    for (const option of Object.keys(options)) {
        if (checkFunctions[option] && checkFunctions[option]() && global.msg[option]) validOptions.push(option);
    }

    if (validOptions.length > 0) {
        return {
            status: true,
            option: validOptions,
            msg: global.msg[validOptions[0]]
        };
    } else {
        return {
            status: false
        };
    }
}