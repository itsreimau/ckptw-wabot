const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const customText = await db.get("bot.text.donate") || null;
            const text = customText ?
                customText
                .replace(/%tag%/g, `@${tools.cmd.getID(ctx.sender.jid)}`)
                .replace(/%name%/g, config.bot.name)
                .replace(/%prefix%/g, ctx.used.prefix)
                .replace(/%command%/g, ctx.used.command)
                .replace(/%footer%/g, config.msg.footer)
                .replace(/%readmore%/g, config.msg.readmore) :
                `${quote("083838039693 (DANA)")}\n` +
                `${quote("─────")}\n` +
                `${quote("https://paypal.me/itsreimau (PayPal)")}\n` +
                `${quote("https://saweria.co/itsreimau (Saweria)")}\n` +
                `${quote("https://trakteer.id/itsreimau (Trakteer)")}\n` +
                "\n" +
                config.msg.footer;

            return await ctx.reply({
                text: text,
                mentions: [ctx.sender.jid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};