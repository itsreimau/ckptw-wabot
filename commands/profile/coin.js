const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        try {
            const userCoin = await db.get(`user.${tools.general.getID(ctx.sender.jid)}.coin`) || 0;

            return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};