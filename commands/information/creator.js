const {
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const vcard = new VCardBuilder()
            .setFullName(config.owner.name)
            .setOrg(config.owner.organization)
            .setNumber(config.owner.number).build();

        return await ctx.reply({
            contacts: {
                displayName: config.owner.name,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};