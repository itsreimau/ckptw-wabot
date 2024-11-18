const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "intro",
    category: "group",
    handler: {
        banned: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        try {
            const groupNumber = ctx.isGroup() ? ctx.id.split("@")[0] : null;
            const introText = await db.get(`group.${groupNumber}.text.intro`) || quote("❎ Grup ini tidak memiliki intro.");

            return await ctx.reply(introText);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};