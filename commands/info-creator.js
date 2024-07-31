const {
    bold,
    VCardBuilder
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "info",
    code: async (ctx) => {
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