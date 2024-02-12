require('../config.js');
const {
    bold,
    VCardBuilder
} = require('@mengkodingan/ckptw');
const {
    sendStatus
} = require('../lib/simple.js');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'developer'],
    category: 'info',
    code: async (ctx) => {
        const vcard = new VCardBuilder()
            .setFullName(global.ownername)
            .setOrg(global.organization)
            .setNumber(global.owner)
            .build();

        await ctx.reply({
            contacts: {
                displayName: global.ownername,
                contacts: [{
                    vcard
                }]
            }
        })
    }
};