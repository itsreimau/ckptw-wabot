const smpl = require('./tools/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} ctx The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status and message if applicable, otherwise null.
 */
exports.handler = async (ctx, options) => {
    try {
        const botNumber = await ctx._client.decodeJid(ctx_client.user.id);
        const senderNumber = ctx._sender.jid.split('@')[0];
        const senderJid = ctx._sender.jid;
        const groupNumber = ctx.isGroup ? m.key.remoteJid.split('@')[0] : null;
        const groupJid = ctx.isGroup ? m.key.remoteJid : null;
        const groupMetadata = ctx.isGroup ? await ctx._client.groupMetadata(groupJid) : null;
        const groupParticipant = groupMetadata ? groupMetadata.participants : null;
        const groupAdmin = groupParticipants ? groupParticipant.filter(p => p.admin !== null).map(p => p.id) : [];
        const groupOwner = groupMetadata ? groupMetadata.owner : null;
        const isAdmin = ctx.isGroup ? groupAdmin.includes(senderJid) : false;
        const isBotAdmin = ctx.isGroup ? groupAdmin.includes(botNumber) : false;
        const isOwner = global.owner.number === senderNumber;
        const msg = global.msg;

        const checkOptions = {
            admin: {
                function: () => !isAdmin,
                msg: msg.admin
            },
            banned: {
                function: async () => await global.db.get(`user.${senderNumber}.isBanned`),
                msg: msg.banned
            },
            botAdmin: {
                function: () => !isBotAdmin,
                msg: msg.botAdmin
            },
            group: {
                function: () => !ctx.isGroup(),
                msg: msg.group
            },
            owner: {
                function: () => !isOwner,
                msg: msg.owner
            },
            private: {
                function: () => ctx.isGroup(),
                msg: msg.private
            }
        };

        for (const option of Object.keys(options)) {
            const checkOption = checkOptions[option];
            if (await checkOption.function()) {
                return {
                    status: true,
                    message: checkOption.msg
                };
            }
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            status: false,
            message: 'An error occurred while processing the request.'
        };
    }

    return {
        status: false,
        message: null
    };
};