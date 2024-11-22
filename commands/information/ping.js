module.exports = {
    name: "ping",
    category: "information",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        return await ctx.reply("Pong!");
    }
};