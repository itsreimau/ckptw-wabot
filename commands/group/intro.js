const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;
            const introText = await db.get(`group.${groupId}.text.intro`) || quote("❎ Grup ini tidak memiliki intro.");

            return await ctx.reply(introText);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};