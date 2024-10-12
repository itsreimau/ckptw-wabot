module.exports = {
    name: "ping",
    category: "information",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => status && ctx.reply(message));

        return ctx.reply("Pong!");
    }
};