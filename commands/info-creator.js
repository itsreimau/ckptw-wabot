const {
    bold,
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "info",
    code: async (ctx) => {
        const {
            name,
            organization,
            number
        } = global.owner;
        const vcard = new VCardBuilder().setFullName(name).setOrg(organization).setNumber(number).build();

        return await ctx.reply({
            contacts: {
                displayName: name,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};