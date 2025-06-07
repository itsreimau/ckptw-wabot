const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "ping",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const pongMsg = await ctx.reply(quote("🏓 Pong!"));
            const responseTime = (performance.now() - startTime).toFixed(2);
            return await ctx.editMessage(pongMsg.key, quote(`🏓 Pong! Merespon dalam ${responseTime}ms.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};