const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 */
exports.handler = (ctx, {
    opt
}) => {
    let result;
    switch (opt) {
        case 'admin':
            result = smpl.isAdmin(ctx);
            break;
        case 'botAdmin':
            result = smpl.isAdminOf(ctx);
            break;
        case 'group':
            result = smpl.isGroup(ctx);
            break;
        case 'owner':
            result = smpl.isOwner(ctx);
            break;
        default:
            throw new Error('Invalid option provided');
    }

    if (result === 0) ctx.reply(global.msg[opt]);
}