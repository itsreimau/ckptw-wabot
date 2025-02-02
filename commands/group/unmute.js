const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "unmute",
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        try {
            const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;
            await db.set(`group.${groupId}.mute`, false);

            return await ctx.reply(quote(`✅ Berhasil me-unmute grup ini dari bot!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};