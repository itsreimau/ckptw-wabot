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

        if (tools.general.isOwner(senderId, ctx.msg.key.id) || userDb?.premium) return await ctx.reply(quote("🤑 Anda memiliki koin tak terbatas."));

        try {
            const userCoin = userDb?.coin || 0;

            return await ctx.reply(quote(`💰 Anda memiliki ${userCoin} koin tersisa.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};