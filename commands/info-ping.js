module.exports = {
    name: "ping",
    category: "info",
    code: async (ctx) => {
        return ctx.reply("Pong!");
    }
};