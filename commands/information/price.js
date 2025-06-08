const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "price",
    aliases: ["belibot", "rent", "rentbot", "sewa", "sewabot"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const customText = await db.get("bot.text.price") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${tools.cmd.getID(ctx.sender.jid)}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                quote("❎ Bot ini tidak memiliki harga.");

            return await ctx.reply({
                text: text,
                mentions: [ctx.sender.jid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};