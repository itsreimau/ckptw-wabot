const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 */
exports.handler = (ctx, options) => {
    const isAdmin = smpl.isAdmin(ctx);
    const isOwner = smpl.isOwner(ctx);

    if (options.admin && isAdmin === 0) ctx.reply(global.msg.admin);

    if (options.botAdmin && smpl.isAdminOf(ctx) === 0) ctx.reply(global.msg.botAdmin);

    if (options.group && smpl.isGroup(ctx) === 0) ctx.reply(global.msg.group);

    if (options.owner && isOwner === 0) ctx.reply(global.msg.owner);

    if (options.private && smpl.isPrivate(ctx) === 0) ctx.reply(global.msg.private);

    if (Object.values(options).every(value => !value)) throw new Error('Invalid option provided');
}