const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ping",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        return await ctx.reply(quote("🏓 Pong!"));
    }
};