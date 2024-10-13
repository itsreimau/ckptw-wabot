module.exports = {
    name: "ping",
    category: "information",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        return ctx.reply("Pong!");
    }
};