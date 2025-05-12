const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "ping",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(quote("🏓 Pong!"));
    }
};