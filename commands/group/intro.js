const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupId = tools.cmd.getID(ctx.id);
            const introText = await db.get(`group.${groupId}.text.intro`) || quote("❎ Grup ini tidak memiliki intro.");

            return await ctx.reply(introText);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};