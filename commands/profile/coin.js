const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "coin",
    aliases: ["koin"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        if (tools.general.isOwner(senderId) && userDb?.premium) return await ctx.reply(quote("🤑 Anda memiliki koin tak terbatas."));

        try {
            const userCoin = await db.get(`user.${senderId}.coin`) || 0;

            return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};