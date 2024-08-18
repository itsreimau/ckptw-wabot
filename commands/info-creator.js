const {
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "info",
    code: async (ctx) => {
        const vcard = new VCardBuilder()
            .setFullName(global.owner.name)
            .setOrg(global.owner.organization)
            .setNumber(global.owner.number).build();

        return await ctx.reply({
            contacts: {
                displayName: global.owner.name,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};