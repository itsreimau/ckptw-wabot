const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "ping",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote("🏓 Pong!"));
    }
};