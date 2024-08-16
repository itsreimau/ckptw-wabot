const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            botAdmin: true,
            group: true
        });
        if (status) return ctx.reply(message);

        try {
            const link = await ctx.group().inviteCode();
            return ctx.reply(`https://chat.whatsapp.com/${link}`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};