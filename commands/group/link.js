module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const code = await ctx.group().inviteCode();

            return await ctx.reply(formatter.quote(`https://chat.whatsapp.com/${code}`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};