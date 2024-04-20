const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 * @returns {string|null} Message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const checkFunctions = {
        private: () => smpl.isPrivate(ctx) === 0,
        group: () => smpl.isGroup(ctx) === 0,
        owner: () => smpl.isOwner(ctx) === 0,
        admin: () => smpl.isAdmin(ctx) === 0,
        botAdmin: () => smpl.isAdminOf(ctx) === 0
    };

    for (const option of Object.keys(options)) {
        if (checkFunctions[option] && checkFunctions[option]()) {
            return global.msg[option];
        }
    }

    return null;
}