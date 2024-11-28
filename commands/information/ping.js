const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ping",
    category: "information",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        return await ctx.reply(quote("🏓 Pong!"));
    }
};