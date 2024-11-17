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

        const introWelcome = await db.get(`group.${groupNumber}.text.welcome`);
        if (!introWelcome) return await ctx.reply(quote("❎ Grup ini tidak memiliki intro."))

        try {
            const link = await ctx.group().inviteCode();
            return await ctx.reply(introWelcome);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};