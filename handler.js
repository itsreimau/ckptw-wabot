const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 * @returns {string|null} Message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const isAdmin = smpl.isAdmin(ctx);
    const isAdminOf = smpl.isAdminOf(ctx);
    const isGroup = smpl.isGroup(ctx);
    const isOwner = smpl.isOwner(ctx);
    const isPrivate = smpl.isPrivate(ctx);

    if (options.private && isPrivate === 0) return global.msg.private;

    if (options.group && isGroup === 0) return global.msg.group;

    if (options.admin && options.owner && isAdmin === 0) return global.msg.admin;

    if (options.owner && isOwner === 0) return global.msg.owner;

    if (options.admin && isAdmin === 0) return global.msg.admin;

    if (options.botAdmin && isAdminOf === 0) return global.msg.botAdmin;

    return null;
}