const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "omute",
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        try {
            const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;
            await db.set(`group.${groupId}.mute`, true);

            return await ctx.reply(quote(`✅ Berhasil me-mute grup ini dari bot!`));
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};