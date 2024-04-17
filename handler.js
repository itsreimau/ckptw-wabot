const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 * @returns {string|null} Message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const isAdmin = smpl.isAdmin(ctx);
    const isOwner = smpl.isOwner(ctx);

    if (options.private && smpl.isPrivate(ctx) === 0) return global.msg.private;

    if (options.group && smpl.isGroup(ctx) === 0) return global.msg.group;

    if (options.owner && isOwner === 0 && !options.botAdmin) return global.msg.owner;

    if (options.admin && isAdmin === 0) return global.msg.admin;

    if (options.botAdmin && smpl.isAdminOf(ctx) === 0 && !options.owner) return global.msg.botAdmin;

    return null;
}