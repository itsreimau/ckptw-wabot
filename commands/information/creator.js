const {
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        const vcard = new VCardBuilder()
            .setFullName(config.owner.name)
            .setOrg(config.owner.organization)
            .setNumber(config.owner.id).build();

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