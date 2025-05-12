const {
    quote
} = require("@im-dims/baileys-library");

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
            return await ctx.reply(quote(`https://chat.whatsapp.com/${code}`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};