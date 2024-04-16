const smpl = require('./lib/simple.js');

/**
 * Handles requests based on the given option.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options, including 'opt'.
 */
exports.handler = (ctx, {
    opt
}) => {
    let isAdmin = smpl.isAdmin(ctx);
    let isOwner = smpl.isOwner(ctx);

    if (isAdmin === 0 && isOwner === 0) {
        ctx.reply(global.msg[opt]);
    } else {
        let result;
        switch (opt) {
            case 'admin':
                result = isAdmin;
                break;
            case 'botAdmin':
                result = smpl.isAdminOf(ctx);
                break;
            case 'group':
                result = smpl.isGroup(ctx);
                break;
            case 'owner':
                result = isOwner;
                break;
            case 'private':
                result = smpl.isPrivate(ctx);
                break;
            default:
                throw new Error('Invalid option provided');
        }

        if (result === 0) ctx.reply(global.msg[opt]);
    }
}