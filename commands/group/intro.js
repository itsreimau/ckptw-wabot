module.exports = {
    name: "intro",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupId = ctx.getId(ctx.id);
            const introText = await db.get(`group.${groupId}.text.intro`) || formatter.quote("❎ Grup ini tidak memiliki intro.");

            return await ctx.reply(introText);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};