const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    handler: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        try {
            const code = await ctx.group().inviteCode();
            return await ctx.reply(`https://chat.whatsapp.com/${code}`);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};