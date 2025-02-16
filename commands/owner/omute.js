const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "omute",
    category: "group",
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
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};