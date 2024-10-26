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
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

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