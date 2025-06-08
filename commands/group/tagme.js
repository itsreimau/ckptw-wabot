module.exports = {
    name: "tagme",
    category: "group",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        try {
            return await ctx.reply({
                text: `@${tools.cmd.getID(ctx.sender.jid)}`,
                mentions: [ctx.sender.jid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};