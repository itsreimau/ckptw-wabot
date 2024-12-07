const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ping",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(quote("🏓 Pong!"));
    }
};