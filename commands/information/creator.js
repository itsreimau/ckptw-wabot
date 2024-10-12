const {
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    handler: {
        cooldown: true
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => status && ctx.reply(message));

        const vcard = new VCardBuilder()
            .setFullName(global.config.owner.name)
            .setOrg(global.config.owner.organization)
            .setNumber(global.config.owner.number).build();

        return await ctx.reply({
            contacts: {
                displayName: global.config.owner.name,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};