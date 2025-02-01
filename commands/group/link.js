const {
    quote
} = require("@mengkodingan/ckptw");

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
            return await ctx.reply(`https://chat.whatsapp.com/${code}`);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};