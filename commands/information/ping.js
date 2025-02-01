const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ping",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote("🏓 Pong!"));
    }
};