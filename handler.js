const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 * @returns {string|null} Message if applicable, otherwise null.
 */
exports.handler = (ctx, options) => {
    const isPrivate = smpl.isPrivate(ctx);
    if (options.private && isPrivate === 0) return global.msg.private;

    const isGroup = smpl.isGroup(ctx);
    else if (options.group && isGroup === 0) return global.msg.group;

    const isOwner = smpl.isOwner(ctx);
    else if (options.owner && isOwner === 0) return global.msg.owner;

    const isAdmin = smpl.isAdmin(ctx);
    else if (options.admin && isAdmin === 0) return global.msg.admin;

    const isAdminOf = smpl.isAdminOf(ctx);
    else if (options.botAdmin && isAdminOf === 0) return global.msg.botAdmin;

    return null;
}