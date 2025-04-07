const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "price",
    aliases: ["belibot", "rent", "rentbot", "sewa", "sewabot"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const senderJid = ctx.sender.jid;
            const senderId = tools.general.getID(senderJid);

            const customText = await db.get(`bot.text.price`) || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${senderId}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                quote("❎ Bot ini tidak memiliki harga.");

            return await ctx.reply({
                text: text,
                mentions: [senderJid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};