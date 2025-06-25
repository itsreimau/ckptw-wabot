const {
    quote
} = require("@itsreimau/gktw");

module.exports = {
    name: "ping",
    category: "information",
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(quote("🏓 Pong!"));
            const responseTime = performance.now() - startTime;
            return await ctx.editMessage(pongMsg.key, quote(`🏓 Pong! Merespon dalam ${tools.msg.convertMsToDuration(responseTime)}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};